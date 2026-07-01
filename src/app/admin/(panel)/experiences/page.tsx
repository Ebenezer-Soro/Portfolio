import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ExperiencesManager } from "@/components/admin/managers/ExperiencesManager";
import type { Experience } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  let experiences: Experience[] = [];
  try {
    experiences = await prisma.experience.findMany({
      orderBy: [{ startDate: "desc" }, { order: "asc" }],
    });
  } catch {
    experiences = [];
  }

  return (
    <>
      <PageHeader
        title="Expériences"
        description="Gérez votre parcours professionnel et votre formation"
      />
      <ExperiencesManager initial={experiences} />
    </>
  );
}
