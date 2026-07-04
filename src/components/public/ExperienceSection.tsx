"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { formatDate, cn } from "@/lib/utils";
import type { Experience } from "@prisma/client";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [filter, setFilter] = useState<"all" | "work" | "education">("all");

  if (!experiences.length) return null;

  const filtered = experiences.filter((e) => filter === "all" || e.type === filter);

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "Tout" },
    { key: "work", label: "Expériences" },
    { key: "education", label: "Formations" },
  ];

  return (
    <section id="experience" className="section-pad relative overflow-hidden bg-[var(--bg-primary)]">
      <SectionDecor variant="accent" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Parcours"
          title="Expériences & Formations"
          description="Mon cheminement professionnel et académique."
        />

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                filter === f.key
                  ? "bg-primary text-white shadow-[var(--shadow-sky)]"
                  : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-primary",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Ligne centrale */}
          <div className="absolute left-4 top-0 h-full w-px bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

          <ul className="space-y-10">
            {filtered.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={exp.id}
                  data-animate
                  className={cn(
                    "relative pl-12 md:w-1/2 md:pl-0",
                    isLeft ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12",
                  )}
                >
                  {/* Point */}
                  <span
                    className={cn(
                      "absolute left-4 top-1.5 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-[var(--bg-primary)] text-primary md:left-auto",
                      isLeft ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2",
                    )}
                  >
                    {exp.type === "work" ? (
                      <Briefcase className="h-4 w-4" />
                    ) : (
                      <GraduationCap className="h-4 w-4" />
                    )}
                  </span>

                  <div className="card-surface p-5">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      {formatDate(exp.startDate, "MMM yyyy")} —{" "}
                      {exp.current ? "Présent" : exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : ""}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                      {exp.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
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
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{exp.description}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
