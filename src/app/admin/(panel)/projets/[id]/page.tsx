import { prisma } from "@/lib/prisma";
import { ProjectEditor } from "@/components/admin/managers/ProjectEditor";
import type { Project } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project: Project | null = null;
  if (id !== "new") {
    try {
      project = await prisma.project.findUnique({ where: { id } });
    } catch {
      project = null;
    }
  }

  return <ProjectEditor project={project} />;
}
