"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Skill } from "@prisma/client";

/**
 * Une tuile par technologie : logo, nom, domaine, et une RÈGLE GRADUÉE
 * plutôt qu'une jauge arrondie. C'est une mesure, pas une performance
 * — et le ton reste honnête, ce qui compte pour les outils encore en
 * apprentissage.
 */
function Tuile({ skill }: { skill: Skill }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const valeur = Math.max(0, Math.min(100, skill.level));
  const initiales = skill.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] p-[1.125rem_1.25rem] shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/55 hover:shadow-[var(--shadow-md),var(--glow-primary)]"
      style={{ padding: "1.125rem 1.25rem" }}
    >
      {/* Le logo est posé sur une plaque claire : la plupart des logos
          de technologies sont dessinés pour un fond blanc et
          disparaîtraient sur le navy. La plaque garantit qu'ils restent
          lisibles dans les DEUX thèmes, sans retouche d'image. */}
      <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-[0_2px_6px_rgb(0_0_0/0.14)]">
        {skill.iconUrl ? (
          <Image
            src={skill.iconUrl}
            alt=""
            width={40}
            height={40}
            className="h-[1.9rem] w-[1.9rem] object-contain"
          />
        ) : (
          <span className="font-display text-xs font-bold text-[#39465a]">{initiales}</span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-display text-base font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {skill.name}
          </span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--text-muted)]">
            {valeur}
          </span>
        </div>
        <div className="regle">
          <span
            className="remplissage"
            style={{
              width: inView ? `${valeur}%` : 0,
              transition: "width var(--duration-slower) var(--ease-spring)",
            }}
          />
        </div>
        <p className="mono-label mt-2 text-[9px]">{skill.category}</p>
      </div>
    </div>
  );
}

export function SkillsSection({ skills, index }: { skills: Skill[]; index?: string }) {
  const categories = useMemo(
    () => ["Tout", ...Array.from(new Set(skills.map((s) => s.category)))],
    [skills],
  );
  const [active, setActive] = useState("Tout");
  const reduce = useReducedMotion();

  if (!skills.length) return null;

  const filtered = active === "Tout" ? skills : skills.filter((s) => s.category === active);

  return (
    <SectionShell id="skills">
      <SectionHeading
        index={index ?? "03"}
        eyebrow="Technologies"
        title="Les outils, et jusqu'où je les ai menés."
        description="Niveaux auto-évalués, volontairement honnêtes : une barre courte veut dire que je sais lire et utiliser l'outil, pas que je bâtirais une architecture autour de lui."
        align="left"
      />

      <div className="rangee-filtres mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "rounded-full border px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-all",
              active === cat
                ? "border-transparent bg-[image:var(--nappe-accent)] text-white shadow-[var(--lueur-accent)]"
                : "border-[var(--border)] bg-[image:var(--nappe)] text-[var(--text-secondary)] hover:-translate-y-px hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.id}
            variants={reduce ? undefined : fadeIn("up", "tween", (i % 8) * 0.04, 0.5)}
            // Apparition déclenchée par l'élément lui-même. Héritée de
            // la section, elle ne se jouait qu'une fois : après un
            // changement de filtre, les nouveaux éléments restaient à
            // opacité nulle — présents, occupant leur place, mais
            // invisibles.
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Tuile skill={skill} />
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
