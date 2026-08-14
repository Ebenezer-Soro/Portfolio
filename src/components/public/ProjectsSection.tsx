"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const techs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return ["Tous", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = useState("Tous");
  const reduce = useReducedMotion();

  if (!projects.length) return null;

  const filtered =
    filter === "Tous" ? projects : projects.filter((p) => p.techStack.includes(filter));
  const shown = filtered.slice(0, 6);

  return (
    <SectionShell id="projects" className="bg-[var(--bg-secondary)]">
      <SectionHeading
        eyebrow="Mon travail"
        title="Projets"
        description="Ces projets illustrent mon savoir-faire à travers des cas concrets. Chacun est décrit brièvement, avec un lien vers le dépôt de code et la démonstration en ligne."
        align="left"
      />

      <div className="rangee-filtres mb-14">
        {techs.slice(0, 8).map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            aria-pressed={filter === tech}
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

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, i) => (
          <motion.div
            key={project.id}
            variants={reduce ? undefined : fadeIn("up", "spring", i * 0.2, 0.75)}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/projets">
          <Button variant="outline" size="lg">
            Tous les projets <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </SectionShell>
  );
}
