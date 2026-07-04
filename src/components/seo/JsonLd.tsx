/**
 * Injecte un bloc de données structurées JSON-LD (schema.org).
 * Rendu côté serveur ; Google accepte le JSON-LD n'importe où dans le document.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Données maîtrisées (construites côté serveur) : injection sûre.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
