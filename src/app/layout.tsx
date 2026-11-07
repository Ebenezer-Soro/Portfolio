import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { getProfile, getSettings } from "@/lib/queries";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { Profile } from "@prisma/client";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

// Police d'affichage : géométrique et un peu technique, c'est elle qui
// donne le ton « ingénieur » de la direction artistique. Variable, donc
// une seule ressource couvre toutes les graisses utilisées (400 à 700).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});


/** Mots-clés : les domaines réellement couverts par le portfolio. */
const MOTS_CLES = [
  "développeur full stack", "développeur web", "développeur mobile", "Next.js", "React",
  "DevSecOps", "cybersécurité", "cryptographie", "réseau", "intelligence artificielle", "portfolio",
];

/** Description de moteur de recherche : une phrase entière, 160 caractères au plus. */
function resumer(texte: string): string {
  const t = texte.replace(/\s+/g, " ").trim();
  return t.length <= 160 ? t : t.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

/*
 * Métadonnées tirées du profil saisi dans le CMS : changer son titre ou sa
 * présentation dans l'admin met aussi à jour l'onglet du navigateur, les
 * résultats de recherche et les aperçus de partage — auparavant figés dans
 * le code. `getProfile` et `getSettings` retombent sur des valeurs par
 * défaut si la base est indisponible : jamais de page cassée pour autant.
 */
/** Profil de repli, pour les seules pages prérendues au build. */
const PROFIL_PAR_DEFAUT: Pick<Profile, "name" | "title" | "bio" | "location"> = {
  name: "Soro Z. Ebenezer",
  title: "Développeur Full Stack & Ingénieur Informatique",
  bio: "Portfolio de Soro Z. Ebenezer : développement web et mobile, cybersécurité, intelligence artificielle.",
  location: null,
};

export async function generateMetadata(): Promise<Metadata> {
  // Au build, aucune base n'est joignable (la CI n'en fournit qu'une
  // factice) : les rares pages prérendues — la 404 notamment — gardent les
  // valeurs de repli. Toutes les autres lisent le profil à chaque requête.
  const enBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
  const [profile, settings] = enBuild
    ? [PROFIL_PAR_DEFAUT, {} as Record<string, string>]
    : await Promise.all([getProfile(), getSettings()]);
  const nom = profile.name;
  const site = settings.site_name?.trim() || nom;
  const titre = `${nom} — ${profile.title}`;
  const description = resumer(profile.bio);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: titre, template: `%s · ${site}` },
    description,
    keywords: profile.location ? [...MOTS_CLES, profile.location] : MOTS_CLES,
    authors: [{ name: nom, url: SITE_URL }],
    creator: nom,
    publisher: nom,
    applicationName: site,
    /*
     * Directives d'indexation.
     *
     * Par défaut, Google limite l'aperçu d'image à une vignette et tronque
     * l'extrait à sa guise. `max-image-preview: large` autorise la grande
     * image — c'est elle qui conditionne l'apparition dans Google Discover
     * et l'affichage des couvertures d'articles —, `max-snippet: -1` lève
     * la limite de longueur de l'extrait. Rien ici n'ouvre l'accès à des
     * pages privées : l'admin reste exclu par son propre `noindex` et par
     * l'en-tête X-Robots-Tag du middleware, qui l'emportent sur ceci.
     */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName: `${site} — Portfolio`,
      title: titre,
      description,
    },
    twitter: { card: "summary_large_image", title: titre, description },
    // Le pack d'icônes vit dans /public : la convention de fichiers de l'App
    // Router ne le détecte pas, il faut donc le déclarer explicitement.
    icons: {
      icon: [
        // L'ICO d'abord : c'est le repli des navigateurs anciens et des
        // agrégateurs qui ne lisent pas la liste.
        { url: "/favicon.ico", sizes: "any" },
        // Le SVG ensuite : les navigateurs récents le préfèrent et
        // l'affichent net à n'importe quelle densité d'écran.
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // 48×48 : la taille que Google réclame pour afficher une icône à
        // côté du résultat de recherche. Sans elle, il redimensionne le
        // 32 et le rendu est flou.
        { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    /*
     * Preuve de propriete pour la Search Console. Ce jeton est public par
     * nature — il est lu dans le HTML de chaque page — et ne donne aucun
     * acces : il atteste seulement que la personne qui a cree la propriete
     * controle le site. A conserver tant que la propriete existe : Google
     * revalide periodiquement et la retire si la balise disparait.
     */
    verification: { google: "kR6V2l22vZjpagr_ke-kwPszaNxmbWS4YV6mZn3wNWw" },
  };
}

// Teinte de la barre du navigateur sur mobile. Depuis Next 15, `themeColor`
// se déclare dans l'export `viewport`, plus dans `metadata`.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce de la requête, posé par le middleware. next-themes injecte un script
  // en ligne (anti-flash au chargement) : sans nonce, la CSP le bloquerait et
  // la page s'afficherait une fraction de seconde dans le mauvais thème.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider nonce={nonce}>
          <MotionProvider>
            <AuthProvider>
              {children}
              <ToastProvider />
            </AuthProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
