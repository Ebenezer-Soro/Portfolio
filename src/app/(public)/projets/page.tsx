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
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Portfolio
        </span>
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
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
