"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function ProjectsSection({ projects, index }: { projects: Project[]; index?: string }) {
  const techs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return ["Tous", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = useState("Tous");

  if (!projects.length) return null;

  const filtered =
    filter === "Tous" ? projects : projects.filter((p) => p.techStack.includes(filter));
  const shown = filtered.slice(0, 5);

  return (
    <SectionShell id="projects">
      <SectionHeading
        index={index ?? "04"}
        eyebrow="Réalisations"
        title="Des plateformes faites pour servir tous les jours."
        description="Chaque projet est décrit brièvement, avec un lien vers la démonstration en ligne. Survolez une carte pour l'aperçu."
        align="left"
      />

      <div className="rangee-filtres mb-12">
        {techs.slice(0, 8).map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            aria-pressed={filter === tech}
            className={cn(
              "rounded-full border px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-all",
              filter === tech
                ? "border-transparent bg-[image:var(--nappe-accent)] text-white shadow-[var(--lueur-accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:-translate-y-px hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
            )}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Le premier projet occupe les DEUX colonnes de la première
          rangée : la hiérarchie se lit dans la grille, pas dans une
          étiquette. Les suivants se rangent par deux en dessous. */}
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((project, i) => (
          <motion.div
            key={project.id}
            variants={fadeIn("up", "spring", i * 0.14, 0.75)}
            // Apparition déclenchée par l'élément lui-même : héritée de
            // la section, elle ne se jouait qu'une fois et les éléments
            // d'un nouveau filtre restaient invisibles.
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={cn(i === 0 && "md:col-span-2")}
          >
            <ProjectCard project={project} large={i === 0} />
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link href="/projets">
          <Button variant="outline" size="lg">
            Tous les projets
            <span className="rond" aria-hidden>
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </Link>
      </div>
    </SectionShell>
  );
}
