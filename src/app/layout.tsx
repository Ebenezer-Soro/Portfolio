import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Soro Z. Ebenezer — Développeur Full Stack & Ingénieur Informatique",
    template: "%s · Soro Z. Ebenezer",
  },
  description:
    "Portfolio de Soro Z. Ebenezer, développeur full stack et ingénieur informatique. Développement web, cybersécurité et intelligence artificielle.",
  keywords: ["développeur", "full stack", "Next.js", "cybersécurité", "IA", "portfolio"],
  authors: [{ name: "Soro Z. Ebenezer" }],
  creator: "Soro Z. Ebenezer",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Soro Z. Ebenezer — Portfolio",
    title: "Soro Z. Ebenezer — Développeur Full Stack",
    description: "Développement web, cybersécurité et intelligence artificielle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soro Z. Ebenezer — Développeur Full Stack",
    description: "Développement web, cybersécurité et intelligence artificielle.",
  },
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
