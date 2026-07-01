"use client";

import { useMemo, useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { cn } from "@/lib/utils";
import type { Skill } from "@prisma/client";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => {
    const set = Array.from(new Set(skills.map((s) => s.category)));
    return set;
  }, [skills]);

  const [active, setActive] = useState(categories[0] ?? "");

  if (!skills.length) return null;

  const filtered = skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="section-pad relative overflow-hidden bg-[var(--bg-secondary)]">
      <SectionDecor variant="primary" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Compétences"
          title="Mon expertise technique"
          description="Un éventail de technologies maîtrisées, du front-end à la sécurité."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
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
          {filtered.map((skill) => (
            <ProgressBar key={skill.id} label={skill.name} value={skill.level} />
          ))}
        </div>
      </div>
    </section>
  );
}
