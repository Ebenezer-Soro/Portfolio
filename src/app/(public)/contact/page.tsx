import type { Metadata } from "next";
import { getProfile } from "@/lib/queries";
import { ContactSection } from "@/components/public/ContactSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-moi pour discuter de votre projet.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    // La section de contact porte desormais son propre decor — un
    // reseau de noeuds qui s'adapte aux deux themes. Le ciel etoile
    // dore qui se trouvait ici n'etait visible que sur fond noir.
    <div className="relative z-0 min-h-screen pt-20">
      <ContactSection profile={profile} index="01" />
    </div>
  );
}
