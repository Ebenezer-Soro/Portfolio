import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { etatStockage } from "./stockage";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const ALLOWED_DOC_TYPES = ["application/pdf"];
export const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

/**
 * `sharp` est chargé À LA DEMANDE, jamais à l'import du module.
 *
 * C'est un module natif : s'il ne se charge pas dans l'environnement de
 * déploiement, un import en tête de fichier fait échouer la fonction entière
 * au démarrage — 500 FUNCTION_INVOCATION_FAILED, avant même notre code, donc
 * sans message exploitable. Chargé ici, l'échec est rattrapable : l'image est
 * alors stockée telle quelle, le navigateur l'ayant déjà réduite.
 */
type Sharp = (typeof import("sharp"))["default"];

async function chargerSharp(): Promise<Sharp | null> {
  try {
    return (await import("sharp")).default;
  } catch (e) {
    console.error("[upload] sharp indisponible, image stockée sans retraitement :", e);
    return null;
  }
}

export type SavedFile = {
  url: string;
  filename: string;
  size: number;
  type: "image" | "pdf";
};

/** Hôte des URLs Vercel Blob — sert de garde-fou avant suppression. */
const BLOB_HOST = "blob.vercel-storage.com";

/** Préfixe des fichiers stockés localement, en développement uniquement. */
const PREFIXE_LOCAL = "/uploads/";

/*
 * L'état du stockage vit dans `stockage.ts`, sans dépendance : une page qui
 * veut seulement l'afficher n'embarque ainsi ni sharp ni le client Blob.
 */
async function stocker(nom: string, contenu: Buffer, contentType: string): Promise<string> {
  const etat = etatStockage();
  if (etat === "blob") {
    const blob = await put(`uploads/${nom}`, contenu, { access: "public", contentType, addRandomSuffix: false });
    return blob.url;
  }
  if (etat === "local") {
    const dossier = path.join(process.cwd(), "public", "uploads");
    await mkdir(dossier, { recursive: true });
    await writeFile(path.join(dossier, nom), contenu);
    return PREFIXE_LOCAL + nom;
  }
  // Message destiné à l'administrateur : il remplace l'erreur technique
  // anglaise de Vercel Blob (« No blob credentials found… »).
  throw new Error(
    "Stockage des médias non configuré : connecte un stockage Blob au projet dans Vercel (onglet Storage) — la connexion fournit BLOB_STORE_ID — ou définis BLOB_READ_WRITE_TOKEN, puis redéploie.",
  );
}

/**
 * Sauvegarde un fichier uploadé sur Vercel Blob (stockage persistant + CDN).
 * Les images sont redimensionnées (max 1920px, qualité 85, conversion webp)
 * via sharp, quand il est disponible. Le stockage exige soit
 * BLOB_READ_WRITE_TOKEN, soit un magasin Blob connecté au projet
 * (BLOB_STORE_ID) ; à défaut, en développement, le dossier public/uploads.
 */
export async function saveUpload(file: File): Promise<SavedFile> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Type de fichier non autorisé.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 10 Mo).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  // PDF : envoi brut
  if (file.type === "application/pdf") {
    const url = await stocker(`${id}.pdf`, buffer, "application/pdf");
    return { url, filename: `${id}.pdf`, size: buffer.length, type: "pdf" };
  }

  // GIF : conservé tel quel (sharp aplatirait l'animation)
  if (file.type === "image/gif") {
    const url = await stocker(`${id}.gif`, buffer, "image/gif");
    return { url, filename: `${id}.gif`, size: buffer.length, type: "image" };
  }

  const sharp = await chargerSharp();
  if (!sharp) {
    // Repli : format d'origine conservé, sans retraitement.
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const url = await stocker(`${id}.${ext}`, buffer, file.type);
    return { url, filename: `${id}.${ext}`, size: buffer.length, type: "image" };
  }

  // Images : redimensionnement + conversion webp
  const output = await sharp(buffer)
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const url = await stocker(`${id}.webp`, output, "image/webp");
  return { url, filename: `${id}.webp`, size: output.length, type: "image" };
}

/** Supprime un fichier stocké d'après son URL. Ignore les URLs externes. */
export async function deleteUpload(url: string): Promise<void> {
  if (url.startsWith(PREFIXE_LOCAL) && process.env.NODE_ENV !== "production") {
    // `basename` : aucune URL ne peut faire sortir la suppression du dossier.
    const nom = path.basename(url);
    try {
      await unlink(path.join(process.cwd(), "public", "uploads", nom));
    } catch {
      // Fichier déjà absent : ignore.
    }
    return;
  }
  if (!url.includes(BLOB_HOST)) return; // n'agit que sur nos propres blobs
  try {
    await del(url);
  } catch {
    // Fichier déjà absent : ignore.
  }
}
