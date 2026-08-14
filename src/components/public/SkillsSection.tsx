"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Skill } from "@prisma/client";

// La grille 3D est lourde et strictement décorative : elle est chargée côté
// client uniquement, après le rendu du contenu utile.
const TechBalls = dynamic(
  () => import("@/components/canvas/TechBalls").then((m) => m.TechBalls),
  { ssr: false, loading: () => <div className="h-[104px]" /> },
);

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category))),
    [skills],
  );

  const [active, setActive] = useState(categories[0] ?? "");
  const reduce = useReducedMotion();

  if (!skills.length) return null;

  const filtered = skills.filter((s) => s.category === active);

  return (
    <SectionShell id="skills" className="bg-[var(--bg-secondary)]">
      <SectionHeading
        eyebrow="Ce que je maîtrise"
        title="Compétences techniques"
        description="Un éventail de technologies, du front-end à la sécurité."
      />

      {/* Billes 3D flottantes — la section « Tech » du modèle. */}
      <div className="mb-16 flex justify-center">
        <div className="w-full max-w-3xl">
          <TechBalls
            items={skills.map((s) => ({ id: s.id, name: s.name, iconUrl: s.iconUrl }))}
          />
        </div>
      </div>

      {/* Le niveau de maîtrise reste une donnée du back-office : on le conserve
          sous les billes plutôt que de le perdre au profit du décor. */}
      <div className="rangee-filtres mb-10 sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              active === cat
                ? "bg-primary text-white shadow-[var(--shadow-sky)]"
                : "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-primary-400 hover:text-primary",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-3xl gap-x-10 gap-y-6 sm:grid-cols-2">
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.id}
            variants={reduce ? undefined : fadeIn("up", "tween", i * 0.05, 0.5)}
          >
            <ProgressBar label={skill.name} value={skill.level} />
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
