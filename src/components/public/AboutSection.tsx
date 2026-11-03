"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Download } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Counter } from "./Counter";
import { Button } from "@/components/ui/Button";
import { fadeIn } from "@/lib/motion";
import type { Profile } from "@prisma/client";

export function AboutSection({
  profile,
  settings,
  index,
}: {
  profile: Profile;
  settings: Record<string, string>;
  index?: string;
}) {
  const reduce = useReducedMotion();

  const stats = [
    { label: "Projets réalisés", value: Number(settings.stats_projects ?? 15), suffix: "+" },
    { label: "Années d'expérience", value: Number(settings.stats_years ?? 3), suffix: "+" },
    { label: "Technologies maîtrisées", value: Number(settings.stats_techs ?? 20), suffix: "+" },
  ];

  const visuel = profile.aboutPhotoUrl || profile.photoUrl;

  return (
    <SectionShell id="about">
      <SectionHeading
        index={index ?? "01"}
        eyebrow="Profil"
        title="Partir du problème, pas du framework."
        description="J'accompagne porteurs de projets et entreprises du premier croquis à la mise en production — avec une lecture à la fois technique, produit et sécurité."
        align="left"
      />

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <motion.div variants={reduce ? undefined : fadeIn("right", "tween", 0.1, 0.9)}>
          {/*
            Le cadre suit le format 3/2 de l'image, et non l'inverse :
            un cadre portrait imposait deux bandes vides considérables à
            une illustration paysage. `object-cover` ne rogne donc
            presque rien, et les repères d'angle cadrent la planche
            comme une vue cotée cadre un ouvrage.
          */}
          <div className="group relative">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-[var(--border)] bg-[image:var(--nappe-haute)] shadow-[var(--shadow-md)]">
              {visuel ? (
                <Image
                  src={visuel}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 1024px) 92vw, 42rem"
                  className="object-cover transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              ) : (
                <span className="grid h-full w-full place-items-center font-display text-7xl font-bold text-[var(--border-strong)]">
                  {profile.name.charAt(0)}
                </span>
              )}
              <span className="equerres" aria-hidden />
            </div>
            <p className="cote mt-3.5">{profile.location ?? "Côte d'Ivoire"}</p>
          </div>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeIn("left", "tween", 0.2, 0.9)}
          className="space-y-8"
        >
          <p className="text-[17px] leading-[30px] text-[var(--text-secondary)]">{profile.bio}</p>

          <div className="grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mono-label mt-1.5 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>

          {profile.cvUrl && (
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="h-4 w-4" /> Télécharger mon CV
              </Button>
            </a>
          )}
        </motion.div>
      </div>
    </SectionShell>
  );
}
