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
    <div className="pt-20">
      <ContactSection profile={profile} />
    </div>
  );
}
