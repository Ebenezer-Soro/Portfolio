/**
 * Envoi de fichiers vers `/api/upload`, côté navigateur.
 *
 * Pourquoi préparer les fichiers AVANT l'envoi :
 *  - Vercel refuse tout corps de requête au-delà de 4,5 Mo, avant même que
 *    notre route s'exécute. Une photo de téléphone dépasse souvent ce seuil :
 *    l'envoi échouait avec une réponse qui n'est pas du JSON, d'où un
 *    message incompréhensible. Les images sont donc réduites ici.
 *  - Les photos d'iPhone peuvent arriver en HEIC, que le serveur n'accepte
 *    pas. Un navigateur qui sait les décoder (Safari) les convertit ici.
 *  - La transparence est conservée (WebP ou PNG, jamais JPEG) : la photo
 *    détourée du hero en dépend.
 *
 * Le serveur retraite ensuite chaque image (sharp, WebP, 1920 px) : ce
 * premier passage ne vise que la taille du transfert.
 */

export type MediaEnvoye = {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
  alt: string | null;
  createdAt: string | Date;
};

/** Marge sous la limite de 4,5 Mo de Vercel (en-têtes multipart compris). */
const LIMITE_ENVOI = 4 * 1024 * 1024;
/** Au-delà, la réduction côté navigateur deviendrait lente et gourmande. */
const LIMITE_SOURCE = 25 * 1024 * 1024;
/** Côté le plus long après réduction : le serveur descendra à 1920 px. */
const COTE_MAX = 2560;
/** En dessous, une image déjà dans un format accepté part telle quelle. */
const SEUIL_REDUCTION = 1.5 * 1024 * 1024;

const FORMATS_SERVEUR = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type OptionsEnvoi = {
  /**
   * Côté le plus long visé, en pixels. Un logo de compétence n'occupe que
   * quelques dizaines de pixels sur sa bille : l'envoyer en 1000 px et 1 Mo
   * ferait télécharger des mégaoctets à chaque visiteur, pour rien.
   */
  coteMax?: number;
};

/** En dessous de ce poids, une image déjà assez petite part telle quelle. */
const SEUIL_PETITE_IMAGE = 200 * 1024;

function typeDe(f: File): string {
  if (f.type) return f.type;
  // Certains navigateurs (fichiers glissés, HEIC sous Windows) laissent le
  // type vide : on le déduit de l'extension.
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  const parExtension: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
    gif: "image/gif", heic: "image/heic", heif: "image/heif", avif: "image/avif", pdf: "application/pdf",
    svg: "image/svg+xml",
  };
  return parExtension[ext] ?? "";
}

const Mo = (n: number) => (n / 1024 / 1024).toFixed(1).replace(".", ",") + " Mo";

function versBlob(canvas: HTMLCanvasElement, type: string, qualite?: number): Promise<Blob | null> {
  return new Promise((resoudre) => canvas.toBlob(resoudre, type, qualite));
}

/**
 * Les logos de technologies sont souvent fournis en SVG. Le serveur refuse ce
 * format — un SVG peut embarquer du script — : il est donc converti ici en
 * image matricielle transparente, et le fichier SVG ne quitte jamais le
 * navigateur.
 */
async function rasteriserSvg(fichier: File, coteMax = 1024): Promise<File> {
  const url = URL.createObjectURL(fichier);
  try {
    const img = new Image();
    await new Promise<void>((ok, ko) => {
      img.onload = () => ok();
      img.onerror = () => ko(new Error(`« ${fichier.name} » : ce SVG est illisible.`));
      img.src = url;
    });
    // Un SVG sans dimensions intrinsèques reçoit un carré par défaut.
    const w0 = img.naturalWidth || 512;
    const h0 = img.naturalHeight || 512;
    const echelle = Math.min(coteMax, 1024) / Math.max(w0, h0);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w0 * echelle);
    canvas.height = Math.round(h0 * echelle);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Impossible de préparer le logo dans ce navigateur.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = (await versBlob(canvas, "image/webp", 0.92)) ?? (await versBlob(canvas, "image/png"));
    if (!blob) throw new Error(`Impossible de convertir « ${fichier.name} ».`);
    const ext = blob.type === "image/webp" ? "webp" : "png";
    return new File([blob], fichier.name.replace(/\.[^.]+$/, "") + "." + ext, { type: blob.type });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Rend un fichier envoyable : format accepté par le serveur, taille sous la limite. */
export async function preparerFichier(fichier: File, options: OptionsEnvoi = {}): Promise<File> {
  const type = typeDe(fichier);
  const limite = options.coteMax ?? COTE_MAX;
  const seuilPoids = options.coteMax ? SEUIL_PETITE_IMAGE : SEUIL_REDUCTION;

  if (type === "application/pdf") {
    if (fichier.size > LIMITE_ENVOI) {
      throw new Error(`« ${fichier.name} » pèse ${Mo(fichier.size)} : 4 Mo maximum pour un PDF. Compresse-le avant de l'envoyer.`);
    }
    return fichier;
  }
  if (type === "image/svg+xml") return rasteriserSvg(fichier, options.coteMax);
  if (!type.startsWith("image/")) {
    throw new Error(`« ${fichier.name} » n'est ni une image ni un PDF.`);
  }
  if (fichier.size > LIMITE_SOURCE) {
    throw new Error(`« ${fichier.name} » pèse ${Mo(fichier.size)} : 25 Mo maximum.`);
  }
  // Un GIF réencodé perdrait son animation : il part tel quel.
  if (type === "image/gif") {
    if (fichier.size > LIMITE_ENVOI) throw new Error(`« ${fichier.name} » : un GIF animé ne peut dépasser 4 Mo.`);
    return fichier;
  }

  const formatAccepte = FORMATS_SERVEUR.includes(type);
  let image: ImageBitmap;
  try {
    image = await createImageBitmap(fichier);
  } catch {
    if (type === "image/heic" || type === "image/heif") {
      throw new Error(
        "Ce navigateur ne sait pas lire les photos HEIC. Sur iPhone : Réglages › Appareil photo › Formats › « Le plus compatible », ou envoie la photo depuis Safari.",
      );
    }
    throw new Error(`« ${fichier.name} » est illisible ou dans un format non pris en charge.`);
  }

  const cote = Math.max(image.width, image.height);
  if (formatAccepte && cote <= limite && fichier.size <= seuilPoids) {
    image.close();
    return fichier;
  }

  const ratio = Math.min(1, limite / cote);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible de préparer l'image dans ce navigateur.");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  // WebP conserve la transparence. Un navigateur qui ne sait pas l'encoder
  // renvoie du PNG à la place : transparence conservée elle aussi.
  let blob = await versBlob(canvas, "image/webp", 0.88);
  if (blob && blob.size > LIMITE_ENVOI) blob = await versBlob(canvas, "image/webp", 0.72);
  if (!blob) throw new Error(`Impossible de convertir « ${fichier.name} ».`);
  if (blob.size > LIMITE_ENVOI) {
    throw new Error(`« ${fichier.name} » reste trop lourde après réduction (${Mo(blob.size)}).`);
  }

  const ext = blob.type === "image/webp" ? "webp" : "png";
  const nom = fichier.name.replace(/\.[^.]+$/, "") + "." + ext;
  return new File([blob], nom, { type: blob.type });
}

async function lireReponse(res: Response): Promise<{ media: MediaEnvoye[] }> {
  const texte = await res.text();
  let donnees: { error?: string; media?: MediaEnvoye[] } | null = null;
  try {
    donnees = JSON.parse(texte);
  } catch {
    // Page d'erreur HTML (limite de taille de Vercel, panne…) : pas de JSON.
  }
  if (!res.ok) {
    if (res.status === 413) throw new Error("Fichier trop lourd pour le serveur (4 Mo maximum par envoi).");
    if (res.status === 401) throw new Error("Ta session a expiré : reconnecte-toi, puis recommence.");
    throw new Error(donnees?.error || `Échec de l'envoi (erreur ${res.status}).`);
  }
  if (!donnees?.media) throw new Error("Réponse inattendue du serveur.");
  return { media: donnees.media };
}

/**
 * Prépare puis envoie les fichiers, UN PAR REQUÊTE : plusieurs photos dans
 * un même envoi dépasseraient ensemble la limite de Vercel.
 */
export async function televerser(fichiers: File[], options: OptionsEnvoi = {}): Promise<MediaEnvoye[]> {
  const envoyes: MediaEnvoye[] = [];
  for (const fichier of fichiers) {
    const pret = await preparerFichier(fichier, options);
    const fd = new FormData();
    fd.append("file", pret);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    envoyes.push(...(await lireReponse(res)).media);
  }
  return envoyes;
}
