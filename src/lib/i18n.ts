/**
 * Bilinguisme — socle commun au site et au back-office.
 *
 * Deux sources de texte, deux mécanismes :
 *
 *  1. Les LIBELLÉS d'interface (menu, boutons, titres de section) sont
 *     figés dans le code : ils vivent dans le dictionnaire ci-dessous.
 *  2. Le CONTENU vient de la base, rédigé en français. Chaque modèle
 *     traduisible porte un champ `i18n`, un objet JSON de la forme
 *     `{ "en": { "title": "…" } }`. `trad()` y pioche, et retombe sur
 *     le français dès qu'une traduction manque.
 *
 * Le français reste la langue de référence : c'est elle qui est servie
 * à la racine du site, et c'est elle qui s'affiche quand une
 * traduction n'a pas encore été saisie. Une page à moitié vide serait
 * pire qu'une page dans la mauvaise langue.
 */

export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];
export const LANGUE_PAR_DEFAUT: Langue = "fr";

export function estLangue(valeur: unknown): valeur is Langue {
  return typeof valeur === "string" && (LANGUES as readonly string[]).includes(valeur);
}

/** Ce que porte le champ `i18n` d'un enregistrement. */
type Traductions = Partial<Record<Langue, Record<string, unknown>>>;

/**
 * Lit un champ dans la langue demandée.
 *
 * @example trad(projet, "title", "en")   // titre anglais, ou français
 *
 * Le repli est volontairement silencieux : un portfolio dont la
 * moitié des cartes seraient vides, faute de traduction, serait plus
 * abîmé qu'un portfolio dont une carte reste en français.
 */
export function trad<T extends { i18n?: unknown }, C extends keyof T & string>(
  enregistrement: T,
  champ: C,
  langue: Langue,
): T[C] {
  const origine = enregistrement[champ];
  if (langue === LANGUE_PAR_DEFAUT) return origine;

  const table = enregistrement.i18n as Traductions | null | undefined;
  const valeur = table?.[langue]?.[champ];
  // Une chaîne vide est une traduction non saisie, pas une traduction
  // vide : l'admin enregistre des champs laissés blancs.
  if (typeof valeur === "string" && valeur.trim() !== "") return valeur as T[C];
  return origine;
}

/** Chemin d'une page dans une langue donnée : `/` en français, `/en/…`. */
export function chemin(url: string, langue: Langue): string {
  const nu = url.startsWith("/") ? url : `/${url}`;
  if (langue === LANGUE_PAR_DEFAUT) return nu;
  return nu === "/" ? "/en" : `/en${nu}`;
}

/* ═══════════════════════════════════════════════════════════════════
   LIBELLÉS D'INTERFACE
   Le français d'abord : c'est la version de référence, celle qu'on
   relit. L'anglais la suit, ligne pour ligne.
   ═══════════════════════════════════════════════════════════════════ */
export const MESSAGES = {
  fr: {
    "nav.accueil": "Accueil",
    "nav.projets": "Projets",
    "nav.publications": "Publications",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.menu": "Menu",

    "cta.parlons": "Parlons-en",
    "cta.realisations": "Voir mes réalisations",
    "cta.echange": "Démarrer un échange",
    "cta.tousProjets": "Tous les projets",
    "cta.tousArticles": "Tous les articles",
    "cta.toutesPublications": "Toutes les publications",
    "cta.lire": "Lire l’article",
    "cta.voirPublication": "Voir la publication",
    "cta.cv": "Télécharger mon CV",
    "cta.siteEnLigne": "Site en ligne",
    "cta.ecrire": "Écrivez-moi",

    "hero.remote": "Freelance · à distance",
    "hero.defiler": "Défiler",
    "hero.fig": "Fig. 01 — ce que je construis",

    "stats.projets": "Projets livrés",
    "stats.annees": "Années de pratique",
    "stats.technos": "Technologies clés",
    "stats.production": "Plateformes en production",
    "stats.reponse": "Délai de réponse",
    "stats.projetsRealises": "Projets réalisés",
    "stats.experience": "Années d’expérience",
    "stats.maitrisees": "Technologies maîtrisées",

    "s.profil.sur": "Profil",
    "s.profil.titre": "Partir du problème, pas du framework.",
    "s.profil.chapeau":
      "J’accompagne porteurs de projets et entreprises du premier croquis à la mise en production — avec une lecture à la fois technique, produit et sécurité.",

    "s.expertise.sur": "Expertise",
    "s.expertise.titre": "Un métier au centre, des domaines autour.",
    "s.expertise.chapeau":
      "Le développement d’applications est mon quotidien. Les autres domaines l’entourent et le servent — annoncés comme tels, sans esbroufe.",
    "s.expertise.centrale": "Discipline centrale",
    "s.expertise.complementaire": "Domaine complémentaire",

    "s.technos.sur": "Technologies",
    "s.technos.titre": "Les outils, et jusqu’où je les ai menés.",
    "s.technos.chapeau":
      "Niveaux auto-évalués, volontairement honnêtes : une barre courte veut dire que je sais lire et utiliser l’outil, pas que je bâtirais une architecture autour de lui.",

    "s.travaux.sur": "Réalisations",
    "s.travaux.titre": "Des plateformes faites pour servir tous les jours.",
    "s.travaux.chapeau":
      "Chaque projet est décrit brièvement, avec un lien vers la démonstration en ligne. Survolez une carte pour l’aperçu.",
    "s.travaux.alaune": "À la une",

    "s.methode.sur": "Ma méthode",
    "s.methode.titre": "Six étapes, à chaque fois.",
    "s.methode.chapeau":
      "Le même chemin du premier échange à la mise en production, dimensionné au projet. Vous validez chaque étape avant que la suivante ne commence.",
    "s.methode.fantome": "MÉTHODE",

    "s.parcours.sur": "Parcours",
    "s.parcours.titre": "Où j’ai travaillé, ce que j’ai étudié.",
    "s.parcours.chapeau": "Mon cheminement professionnel et académique, dans l’ordre.",
    "s.parcours.aujourdhui": "aujourd’hui",

    "s.publications.sur": "Publications",
    "s.publications.titre": "Ce que je partage, et où.",
    "s.publications.chapeau":
      "Mes derniers partages sur les réseaux professionnels, rassemblés en un seul endroit.",

    "s.journal.sur": "Journal",
    "s.journal.titre": "Notes de chantier.",
    "s.journal.chapeau": "Décisions, compromis, et le bug qui méritait d’être documenté.",

    "s.faq.titre": "Les réponses avant le premier appel.",
    "s.faq.chapeau": "Les questions qui reviennent chaque fois — périmètre, délais, prix, propriété.",

    "s.reco.sur": "Recommandations",
    "s.reco.titre": "Ce que disent celles et ceux avec qui je travaille.",
    "s.reco.chiffres": "En chiffres",

    "s.contact.sur": "Contact",
    "s.contact.titre": "Dites-moi ce que vous construisez.",
    "s.contact.chapeau":
      "Un projet, une question, ou un second avis sur ce que vous avez déjà — je réponds sous 24 à 48 heures.",
    "s.contact.joindre": "Me joindre directement",

    "contact.email": "E-mail",
    "contact.telephone": "Téléphone",
    "contact.lieu": "Localisation",
    "contact.dispo": "Disponibilité",
    "contact.langues": "Français (langue maternelle) · Anglais (professionnel)",

    "form.nom": "Nom",
    "form.nomPh": "Votre nom",
    "form.email": "E-mail",
    "form.emailPh": "vous@exemple.com",
    "form.sujet": "Sujet",
    "form.sujetPh": "De quoi s’agit-il ?",
    "form.message": "Message",
    "form.messagePh": "Décrivez votre projet, vos contraintes et votre échéance.",
    "form.envoyer": "Envoyer le message",
    "form.envoye": "Message envoyé ! Je vous répondrai rapidement.",
    "form.erreur": "Une erreur est survenue. Réessayez.",

    "appel.titre": "Un projet à construire ?",
    "appel.corps":
      "Dites-moi le problème avant la solution. Je reviens vers vous avec un périmètre, un délai et un avis honnête sur ce qui est réaliste.",

    "pied.navigation": "Navigation",
    "pied.accroche": "Des plateformes web conçues, développées et déployées depuis {lieu} — pour des clients partout.",
    "pied.ouvert": "Ouvert aux nouveaux projets",
    "pied.droits": "Tous droits réservés",
    "pied.signature": "Conçu et développé sur mesure",

    "filtre.tout": "Tout",
    "filtre.tous": "Tous",
    "filtre.experiences": "Expériences",
    "filtre.formations": "Formations",

    "a11y.theme.clair": "Passer au thème clair",
    "a11y.theme.sombre": "Passer au thème sombre",
    "a11y.langue": "Changer de langue",
    "a11y.precedent": "Précédent",
    "a11y.suivant": "Suivant",
  },

  en: {
    "nav.accueil": "Home",
    "nav.projets": "Work",
    "nav.publications": "Publications",
    "nav.blog": "Journal",
    "nav.contact": "Contact",
    "nav.menu": "Menu",

    "cta.parlons": "Let’s talk",
    "cta.realisations": "View selected work",
    "cta.echange": "Start a conversation",
    "cta.tousProjets": "All projects",
    "cta.tousArticles": "All articles",
    "cta.toutesPublications": "All publications",
    "cta.lire": "Read the article",
    "cta.voirPublication": "View the post",
    "cta.cv": "Download my CV",
    "cta.siteEnLigne": "Live site",
    "cta.ecrire": "Write to me",

    "hero.remote": "Freelance · remote",
    "hero.defiler": "Scroll",
    "hero.fig": "Fig. 01 — what I build",

    "stats.projets": "Projects delivered",
    "stats.annees": "Years building",
    "stats.technos": "Core technologies",
    "stats.production": "Platforms in production",
    "stats.reponse": "Reply time",
    "stats.projetsRealises": "Projects delivered",
    "stats.experience": "Years of experience",
    "stats.maitrisees": "Technologies used",

    "s.profil.sur": "Profile",
    "s.profil.titre": "Start from the problem, not the framework.",
    "s.profil.chapeau":
      "I work with project owners and companies from the first sketch to production — with a technical, product and security mindset.",

    "s.expertise.sur": "Expertise",
    "s.expertise.titre": "One discipline at the centre, others around it.",
    "s.expertise.chapeau":
      "Building applications is my daily work. The other fields surround and serve it — stated as such, not oversold.",
    "s.expertise.centrale": "Core discipline",
    "s.expertise.complementaire": "Supporting field",

    "s.technos.sur": "Technology",
    "s.technos.titre": "The tools, and how far I’ve taken them.",
    "s.technos.chapeau":
      "Self-assessed levels, kept deliberately honest: a short bar means I can read and use the tool, not that I would architect a system around it.",

    "s.travaux.sur": "Selected work",
    "s.travaux.titre": "Platforms built to be used every day.",
    "s.travaux.chapeau":
      "Each project is described briefly, with a link to the live site. Hover a card to preview it.",
    "s.travaux.alaune": "Featured",

    "s.methode.sur": "How I work",
    "s.methode.titre": "Six steps, every time.",
    "s.methode.chapeau":
      "The same path from first conversation to production, sized to the project. You validate each step before the next one starts.",
    "s.methode.fantome": "PROCESS",

    "s.parcours.sur": "Journey",
    "s.parcours.titre": "Where I’ve worked and what I’ve studied.",
    "s.parcours.chapeau": "My professional and academic path, in order.",
    "s.parcours.aujourdhui": "present",

    "s.publications.sur": "Publications",
    "s.publications.titre": "What I share, and where.",
    "s.publications.chapeau":
      "My latest posts on professional networks, gathered in one place.",

    "s.journal.sur": "Journal",
    "s.journal.titre": "Notes from the build.",
    "s.journal.chapeau": "Decisions, trade-offs, and the occasional bug worth documenting.",

    "s.faq.titre": "Answers before the first call.",
    "s.faq.chapeau": "The questions that come up every time — scope, timeline, pricing, ownership.",

    "s.reco.sur": "Recommendations",
    "s.reco.titre": "What the people I work with say.",
    "s.reco.chiffres": "By the numbers",

    "s.contact.sur": "Contact",
    "s.contact.titre": "Tell me what you’re building.",
    "s.contact.chapeau":
      "A project, a question, or a second opinion on something you already have — I reply within 24 to 48 hours.",
    "s.contact.joindre": "Reach me directly",

    "contact.email": "Email",
    "contact.telephone": "Phone",
    "contact.lieu": "Location",
    "contact.dispo": "Availability",
    "contact.langues": "French (native) · English (professional)",

    "form.nom": "Name",
    "form.nomPh": "Your name",
    "form.email": "Email",
    "form.emailPh": "you@example.com",
    "form.sujet": "Subject",
    "form.sujetPh": "What is this about?",
    "form.message": "Message",
    "form.messagePh": "Describe your project, your constraints and your deadline.",
    "form.envoyer": "Send message",
    "form.envoye": "Message sent! I’ll get back to you shortly.",
    "form.erreur": "Something went wrong. Please try again.",

    "appel.titre": "Have something to build?",
    "appel.corps":
      "Tell me the problem before the solution. I’ll come back with a scope, a timeline and an honest view of what is realistic.",

    "pied.navigation": "Navigation",
    "pied.accroche": "Web platforms designed, built and deployed from {lieu} — for clients anywhere.",
    "pied.ouvert": "Open to new projects",
    "pied.droits": "All rights reserved",
    "pied.signature": "Designed and built to measure",

    "filtre.tout": "All",
    "filtre.tous": "All",
    "filtre.experiences": "Experience",
    "filtre.formations": "Education",

    "a11y.theme.clair": "Switch to light theme",
    "a11y.theme.sombre": "Switch to dark theme",
    "a11y.langue": "Change language",
    "a11y.precedent": "Previous",
    "a11y.suivant": "Next",
  },
} as const;

export type CleMessage = keyof (typeof MESSAGES)["fr"];

/**
 * Traducteur de libellés. `valeurs` remplace les marqueurs `{nom}`.
 *
 * Le type de `MESSAGES.en` est contraint par celui de `MESSAGES.fr` :
 * une clé oubliée dans la traduction anglaise devient une erreur de
 * compilation, pas un trou découvert en production.
 */
export function traducteur(langue: Langue) {
  const table = MESSAGES[langue];
  return (cle: CleMessage, valeurs?: Record<string, string>): string => {
    const brut: string = table[cle] ?? MESSAGES[LANGUE_PAR_DEFAUT][cle];
    if (!valeurs) return brut;
    return brut.replace(/\{(\w+)\}/g, (entier, nom: string) => valeurs[nom] ?? entier);
  };
}

/** Vérification à la compilation : l'anglais couvre toutes les clés. */
const _completude: Record<CleMessage, string> = MESSAGES.en;
void _completude;
