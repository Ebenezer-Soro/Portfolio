/**
 * Source unique de l'URL publique du site : URL canoniques, sitemap,
 * Open Graph, JSON-LD.
 *
 * Priorité :
 *   1. NEXT_PUBLIC_SITE_URL — à définir dès qu'un domaine personnalisé existe ;
 *   2. VERCEL_PROJECT_PRODUCTION_URL — fourni automatiquement par Vercel
 *      (domaine de production, sans protocole) ;
 *   3. NEXTAUTH_URL ;
 *   4. localhost, en développement.
 * Sans le 2, un déploiement sans variable renseignée publiait un sitemap et
 * des URL canoniques pointant vers http://localhost:3000.
 */
const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (production ? `https://${production}` : undefined) ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

/** Transforme un chemin relatif (/uploads/…) en URL absolue. */
export function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
