import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProjectsAdminList } from "@/components/admin/managers/ProjectsAdminList";
import type { Project } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProjetsPage() {
  let projects: Project[] = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch {
    projects = [];
  }

  return (
    <>
      <PageHeader
        title="Projets"
        description="Gérez vos réalisations et études de cas"
        action={
          <Link href="/admin/projets/new">
            <Button>
              <Plus className="h-4 w-4" /> Nouveau projet
            </Button>
          </Link>
        }
      />
      <ProjectsAdminList projects={projects} />
    </>
  );
}
