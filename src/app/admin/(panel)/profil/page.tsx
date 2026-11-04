import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/managers/ProfileForm";
import type { Profile } from "@prisma/client";

export const dynamic = "force-dynamic";

const FALLBACK: Profile = {
  id: "singleton",
  name: "Soro Z. Ebenezer",
  title: "Développeur Full Stack & Ingénieur Informatique",
  bio: "",
  photoUrl: null,
  aboutPhotoUrl: null,
  logoUrl: null,
  email: null,
  phone: null,
  location: "Abidjan, Côte d'Ivoire",
  cvUrl: null,
  isAvailable: true,
  updatedAt: new Date(0),
};

export default async function ProfilPage() {
  let profile: Profile = FALLBACK;
  try {
    profile = (await prisma.profile.findFirst()) ?? FALLBACK;
  } catch {
    profile = FALLBACK;
  }

  return (
    <>
      <PageHeader title="Mon Profil" description="Gérez vos informations publiques" />
      <ProfileForm profile={profile} />
    </>
  );
}
