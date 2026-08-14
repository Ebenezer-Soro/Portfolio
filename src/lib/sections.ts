/**
 * Sections masquables de la page d'accueil.
 *
 * La visibilité est stockée dans `SiteSetting` sous la clé
 * `section_<id>_visible`. Aucune migration n'est nécessaire : le modèle est
 * déjà un simple couple clé/valeur.
 *
 * Convention : une clé ABSENTE vaut « visible ». Activer la fonctionnalité ne
 * fait donc disparaître aucune section existante, et une clé mal orthographiée
 * ne peut pas vider la page par accident.
 */
export const SECTIONS_MASQUABLES = [
  { id: "about", label: "À propos", aide: "Bio, statistiques et illustration" },
  { id: "services", label: "Services", aide: "Cartes de prestations" },
  { id: "skills", label: "Compétences", aide: "Billes 3D et niveaux" },
  { id: "experience", label: "Expériences & Formations", aide: "Frise chronologique" },
  { id: "projects", label: "Projets", aide: "Sélection de réalisations" },
  { id: "publications", label: "Publications", aide: "Partages sur les réseaux" },
  { id: "blog", label: "Blog", aide: "Derniers articles" },
  { id: "faq", label: "FAQ", aide: "Questions fréquentes" },
  { id: "testimonials", label: "Témoignages", aide: "Avis clients" },
  { id: "contact", label: "Contact", aide: "Formulaire et coordonnées" },
] as const;

export type IdSection = (typeof SECTIONS_MASQUABLES)[number]["id"];

/** Clé de réglage associée à une section. */
export function cleVisibilite(id: string): string {
  return `section_${id}_visible`;
}

/**
 * Une section est visible sauf si son réglage vaut explicitement « false ».
 * Le hero n'est pas concerné : il porte l'identité de la page.
 */
export function sectionVisible(
  settings: Record<string, string>,
  id: IdSection,
): boolean {
  return settings[cleVisibilite(id)] !== "false";
}
