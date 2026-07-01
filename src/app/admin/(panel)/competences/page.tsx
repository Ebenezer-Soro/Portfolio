import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { SkillsManager } from "@/components/admin/managers/SkillsManager";
import type { Skill } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CompetencesPage() {
  let skills: Skill[] = [];
  try {
    skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  } catch {
    skills = [];
  }

  return (
    <>
      <PageHeader title="Compétences" description="Gérez vos compétences techniques par catégorie" />
      <SkillsManager initial={skills} />
    </>
  );
}
