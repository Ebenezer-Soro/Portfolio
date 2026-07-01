"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const techs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return ["Tous", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = useState("Tous");

  if (!projects.length) return null;

  const filtered =
    filter === "Tous" ? projects : projects.filter((p) => p.techStack.includes(filter));
  const shown = filtered.slice(0, 6);

  return (
    <section id="projects" className="section-pad relative overflow-hidden bg-[var(--bg-secondary)]">
      <SectionDecor variant="accent" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Réalisations"
          title="Mes projets"
          description="Une sélection de projets qui illustrent mon savoir-faire."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {techs.slice(0, 8).map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                filter === tech
                  ? "bg-primary text-white shadow-[var(--shadow-sky)]"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-primary-400 hover:text-primary",
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/projets">
            <Button variant="outline" size="lg">
              Tous les projets <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
