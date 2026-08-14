import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/queries";
import { ProjectsListing } from "@/components/public/ProjectsListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projets",
  description: "Découvrez l'ensemble de mes projets et réalisations.",
  alternates: { canonical: "/projets" },
};

export default async function ProjetsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="container-page pt-32 pb-20">
      <header className="mb-12 text-center">
        <p className="section-sub-text">Portfolio</p>
        <h1 className="section-head-text mt-2 text-[var(--text-primary)]">
          Tous mes projets
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
          Une vue d’ensemble de mes réalisations, du web à l’IA en passant par la sécurité.
        </p>
      </header>

      <ProjectsListing projects={projects} />
    </div>
  );
}
