"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";
import { formatDate, cn } from "@/lib/utils";
import type { Experience } from "@prisma/client";

/**
 * Parcours — un rail unique à gauche, sur tous les écrans.
 *
 * La version précédente alternait gauche/droite au-delà de 768 px.
 * Une frise en zigzag se lit mal : l'œil fait des allers-retours, et
 * sur mobile elle doublait la hauteur. Les dates en monospace à gauche
 * du titre suffisent à donner le rythme, et chaque étape est posée sur
 * une surface — sans elle, la frise n'était qu'une suite de
 * paragraphes alignés le long d'un trait.
 */
export function ExperienceSection({ experiences, index }: { experiences: Experience[]; index?: string }) {
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
    <SectionShell id="experience" plage>
      <SectionHeading
        index={index ?? "06"}
        eyebrow="Parcours"
        title="Où j'ai travaillé, ce que j'ai étudié."
        description="Mon cheminement professionnel et académique, dans l'ordre."
        align="left"
      />

      <div className="rangee-filtres mb-12">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              "rounded-full border px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-all",
              filter === f.key
                ? "border-transparent bg-[image:var(--nappe-accent)] text-white shadow-[var(--lueur-accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:-translate-y-px hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative max-w-4xl">
        <span
          aria-hidden
          className="absolute bottom-2 left-[5px] top-2 w-px bg-[var(--border)]"
        />

        <ul className="flex flex-col gap-9">
          {filtered.map((exp, i) => (
            <motion.li
              key={exp.id}
              variants={reduce ? undefined : fadeIn("up", "spring", i * 0.12, 0.7)}
              // Apparition déclenchée par l'élément lui-même : héritée
              // de la section, elle ne se jouait qu'une fois et les
              // éléments d'un nouveau filtre restaient invisibles.
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, amount: 0.2 }}
              className="group relative pl-9"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-[0.55rem] h-[11px] w-[11px] rotate-45 rounded-sm border border-primary transition-all",
                  exp.current
                    ? "bg-primary shadow-[0_0_0_4px_rgb(var(--c-primary)/0.15)]"
                    : "bg-[var(--bg-primary)] group-hover:bg-primary group-hover:shadow-[0_0_0_4px_rgb(var(--c-primary)/0.15)]",
                )}
              />

              <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 group-hover:translate-x-1 group-hover:border-primary/45 group-hover:shadow-[var(--shadow-md)] sm:p-[1.5rem_1.625rem]">
                <p className="flex items-center gap-2">
                  <span className="mono-label text-primary">
                    {formatDate(exp.startDate, "MMM yyyy")} —{" "}
                    {exp.current
                      ? "aujourd'hui"
                      : exp.endDate
                        ? formatDate(exp.endDate, "MMM yyyy")
                        : ""}
                  </span>
                  {exp.type === "work" ? (
                    <Briefcase className="h-4 w-4 text-[var(--text-muted)]" />
                  ) : (
                    <GraduationCap className="h-4 w-4 text-[var(--text-muted)]" />
                  )}
                </p>

                <h3 className="mt-1.5 font-display text-[1.375rem] font-bold text-[var(--text-primary)]">
                  {exp.title}
                </h3>
                <p className="text-[15px] font-semibold text-primary">{exp.organization}</p>

                {exp.location && (
                  <p className="mono-label mt-1.5 inline-flex items-center gap-1.5 text-[10px]">
                    <MapPin className="h-3.5 w-3.5" /> {exp.location}
                  </p>
                )}
                {exp.description && (
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {exp.description}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
