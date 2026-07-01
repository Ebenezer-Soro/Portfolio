"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function ProjectsListing({ projects }: { projects: Project[] }) {
  const techs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return ["Tous", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = useState("Tous");

  if (!projects.length) {
    return (
      <p className="py-20 text-center text-[var(--text-muted)]">
        Aucun projet publié pour le moment.
      </p>
    );
  }

  const filtered =
    filter === "Tous" ? projects : projects.filter((p) => p.techStack.includes(filter));

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {techs.map((tech) => (
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
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
