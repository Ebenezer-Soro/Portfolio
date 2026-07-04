import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
