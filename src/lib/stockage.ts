/**
 * Où vont les fichiers envoyés depuis l'administration.
 *
 * Ce module ne dépend de RIEN : il se contente de lire l'environnement. Il
 * est séparé de `upload.ts`, qui charge sharp et le client Vercel Blob —
 * deux modules natifs qu'une page n'a aucune raison d'embarquer pour
 * afficher un simple avertissement.
 */
export type EtatStockage = "blob" | "local" | "absent";

/**
 *  - « blob »   : un jeton Vercel Blob est configuré ;
 *  - « local »  : sans jeton, EN DÉVELOPPEMENT, les fichiers vont dans
 *    public/uploads — pour travailler sans compte Vercel ;
 *  - « absent » : sans jeton en production. Le système de fichiers y est en
 *    lecture seule : aucun envoi ne peut aboutir.
 */
export function etatStockage(): EtatStockage {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "production" ? "absent" : "local";
}
