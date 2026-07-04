import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const ALLOWED_DOC_TYPES = ["application/pdf"];
export const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

export type SavedFile = {
  url: string;
  filename: string;
  size: number;
  type: "image" | "pdf";
};

/** Hôte des URLs Vercel Blob — sert de garde-fou avant suppression. */
const BLOB_HOST = "blob.vercel-storage.com";

/**
 * Sauvegarde un fichier uploadé sur Vercel Blob (stockage persistant + CDN).
 * Les images sont redimensionnées (max 1920px, qualité 85, conversion webp)
 * via sharp. Requiert la variable d'environnement BLOB_READ_WRITE_TOKEN.
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
    const blob = await put(`uploads/${id}.pdf`, buffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });
    return { url: blob.url, filename: `${id}.pdf`, size: buffer.length, type: "pdf" };
  }

  // GIF : conservé tel quel (sharp aplatirait l'animation)
  if (file.type === "image/gif") {
    const blob = await put(`uploads/${id}.gif`, buffer, {
      access: "public",
      contentType: "image/gif",
      addRandomSuffix: false,
    });
    return { url: blob.url, filename: `${id}.gif`, size: buffer.length, type: "image" };
  }

  // Images : redimensionnement + conversion webp
  const output = await sharp(buffer)
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const blob = await put(`uploads/${id}.webp`, output, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
  });
  return { url: blob.url, filename: `${id}.webp`, size: output.length, type: "image" };
}

/** Supprime un fichier Vercel Blob d'après son URL. Ignore les URLs externes. */
export async function deleteUpload(url: string): Promise<void> {
  if (!url.includes(BLOB_HOST)) return; // n'agit que sur nos propres blobs
  try {
    await del(url);
  } catch {
    // Fichier déjà absent : ignore.
  }
}
