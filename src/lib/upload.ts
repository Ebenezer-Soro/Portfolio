import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
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

async function ensureDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * Sauvegarde un fichier uploadé. Les images sont redimensionnées
 * (max 1920px, qualité 85, conversion webp) via sharp.
 */
export async function saveUpload(file: File): Promise<SavedFile> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Type de fichier non autorisé.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 10 Mo).");
  }

  await ensureDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  // PDF : sauvegarde brute
  if (file.type === "application/pdf") {
    const filename = `${id}.pdf`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
      size: buffer.length,
      type: "pdf",
    };
  }

  // GIF : conservé tel quel (sharp aplatirait l'animation)
  if (file.type === "image/gif") {
    const filename = `${id}.gif`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
      size: buffer.length,
      type: "image",
    };
  }

  // Images : redimensionnement + conversion webp
  const filename = `${id}.webp`;
  const output = await sharp(buffer)
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  await fs.writeFile(path.join(UPLOAD_DIR, filename), output);
  return {
    url: `/uploads/${filename}`,
    filename,
    size: output.length,
    type: "image",
  };
}

/** Supprime un fichier physique d'après son URL publique. */
export async function deleteUpload(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const filename = path.basename(url);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // Fichier déjà absent : ignore.
  }
}
