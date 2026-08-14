/**
 * Injecte un bloc de données structurées JSON-LD (schema.org).
 * Rendu côté serveur ; Google accepte le JSON-LD n'importe où dans le document.
 *
 * Volontairement SANS nonce, malgré la CSP stricte. Deux raisons :
 *
 * 1. Un `<script>` dont le type n'est pas exécutable est un « data block » au
 *    sens de la spécification HTML : il n'est jamais préparé pour exécution,
 *    donc `script-src` ne s'y applique pas. Vérifié : aucune violation CSP.
 * 2. Le navigateur vide l'attribut `nonce` du DOM juste après l'analyse (pour
 *    empêcher son vol via un sélecteur CSS d'attribut). React comparait alors
 *    le `nonce` du rendu serveur à une chaîne vide côté client, et signalait
 *    une divergence d'hydratation à chaque chargement.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Données maîtrisées (construites côté serveur). `<` est échappé pour
      // qu'une valeur contenant « </script> » ne puisse pas refermer la balise
      // et injecter du balisage.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
