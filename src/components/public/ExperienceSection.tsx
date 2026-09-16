"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";
import type { Experience } from "@prisma/client";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [filter, setFilter] = useState<"all" | "work" | "education">("all");
  const reduce = useReducedMotion();

  if (!experiences.length) return null;

  const filtered = experiences.filter((e) => filter === "all" || e.type === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "Tout" },
    { key: "work", label: "Expériences" },
    { key: "education", label: "Formations" },
  ];

  return (
    <SectionShell id="experience" className="bg-[var(--bg-primary)]">
      <SectionHeading
        eyebrow="Mon parcours jusqu'ici"
        title="Expériences & Formations"
        description="Mon cheminement professionnel et académique."
      />

      <div className="rangee-filtres mb-14 sm:justify-center">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              filter === f.key
                ? "bg-primary text-white shadow-[var(--shadow-sky)]"
                : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-primary-400 hover:text-primary",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline verticale du modèle : rail central, pastille colorée,
          carte sur fond #1f1f1f en sombre (var(--surface-timeline)). */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-4 top-0 h-full w-px bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

        <ul className="space-y-10">
          {filtered.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.li
                key={exp.id}
                variants={
                  reduce ? undefined : fadeIn(isLeft ? "right" : "left", "spring", i * 0.15, 0.7)
                }
                // Apparition déclenchée par l'élément lui-même. Héritée de la
                // section, elle ne se jouait qu'une fois : après un changement de
                // filtre, les nouveaux éléments restaient à opacité nulle —
                // présents, occupant leur place, mais invisibles.
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, amount: 0.2 }}
                className={cn(
                  "relative pl-12 md:w-1/2 md:pl-0",
                  isLeft ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12",
                )}
              >
                <span
                  className={cn(
                    "absolute left-4 top-1.5 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_0_4px_var(--bg-primary)] md:left-auto",
                    isLeft ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2",
                  )}
                >
                  {exp.type === "work" ? (
                    <Briefcase className="h-4 w-4" />
                  ) : (
                    <GraduationCap className="h-4 w-4" />
                  )}
                </span>

                <div className="rounded-2xl bg-[var(--surface-timeline)] p-6 shadow-card">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {formatDate(exp.startDate, "MMM yyyy")} —{" "}
                    {exp.current
                      ? "Présent"
                      : exp.endDate
                        ? formatDate(exp.endDate, "MMM yyyy")
                        : ""}
                  </span>
                  <h3 className="mt-1 font-display text-[24px] font-bold text-[var(--text-primary)]">
                    {exp.title}
                  </h3>
                  <p className="text-[16px] font-semibold text-[var(--text-secondary)]">
                    {exp.organization}
                  </p>
                  {exp.location && (
                    <p
                      className={cn(
                        "mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]",
                        isLeft && "md:justify-end",
                      )}
                    >
                      <MapPin className="h-3 w-3" /> {exp.location}
                    </p>
                  )}
                  {exp.description && (
                    <p className="mt-3 text-[14px] leading-relaxed tracking-wide text-[var(--text-secondary)]">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}
