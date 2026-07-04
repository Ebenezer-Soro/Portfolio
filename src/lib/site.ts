/**
 * Source unique de l'URL publique du site.
 * Priorité : NEXT_PUBLIC_SITE_URL > NEXTAUTH_URL > localhost.
 * En production (Vercel), renseigne NEXTAUTH_URL avec ton vrai domaine.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

/** Transforme un chemin relatif (/uploads/…) en URL absolue. */
export function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
