import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { getProfile, getSettings } from "@/lib/queries";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { Profile } from "@prisma/client";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

// Police d'affichage du modèle. Poppins n'est pas une police variable :
// les graisses doivent être déclarées explicitement. 900 porte la signature
// visuelle du modèle (titres `font-black`).
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
  };
}

// Teinte de la barre du navigateur sur mobile. Depuis Next 15, `themeColor`
// se déclare dans l'export `viewport`, plus dans `metadata`.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
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
      className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider nonce={nonce}>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
