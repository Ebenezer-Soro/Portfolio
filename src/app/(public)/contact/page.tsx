import type { Metadata } from "next";
import { getProfile } from "@/lib/queries";
import { ContactSection } from "@/components/public/ContactSection";
import { StarsCanvas } from "@/components/canvas/StarsCanvas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-moi pour discuter de votre projet.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    // Même traitement que le bloc final de l'accueil : la section de contact
    // est transparente, le fond et le ciel étoilé sont fournis ici.
    <div className="relative z-0 min-h-screen bg-[var(--bg-secondary)] pt-20">
      <StarsCanvas />
      <div className="relative z-10">
        <ContactSection profile={profile} />
      </div>
    </div>
  );
}
