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
}: {
  profile: Profile;
  settings: Record<string, string>;
}) {
  const reduce = useReducedMotion();

  const stats = [
    { label: "Projets réalisés", value: Number(settings.stats_projects ?? 15), suffix: "+" },
    { label: "Années d'expérience", value: Number(settings.stats_years ?? 3), suffix: "+" },
    { label: "Technologies maîtrisées", value: Number(settings.stats_techs ?? 20), suffix: "+" },
  ];

  return (
    <SectionShell id="about" className="bg-[var(--bg-primary)]">
      <SectionHeading eyebrow="Introduction" title="Aperçu" align="left" />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div variants={reduce ? undefined : fadeIn("right", "tween", 0.1, 0.9)}>
          {/*
            Zone pensée pour une illustration, pas pour une photo recadrée :
            `object-contain` sur un cadre au format 4/5, donc AUCUN rognage
            quel que soit le rapport de l'image. Un `aspect-square` avec
            `object-cover`, comme auparavant, aurait amputé une illustration
            large ou haute.
          */}
          <div className="group relative mx-auto w-full max-w-md">
            {/* Halo doré et anneau pointillé : même grammaire que le hero,
                en plus discret pour ne pas concurrencer l'illustration.

                Centrage par `inset-0 m-auto` et NON par
                `left-1/2 -translate-x-1/2`. `transform` est une propriété
                unique : l'anneau porte `animate-spin-slow`, dont l'image clé
                écrit `transform: rotate(...)` et efface donc la translation de
                centrage. L'anneau partait alors d'une demi-largeur vers la
                droite et élargissait la page sur petit écran. Les marges
                automatiques centrent sans toucher à `transform`. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto aspect-square h-fit w-[108%] rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 68%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto aspect-square h-fit w-[112%] animate-spin-slow rounded-full border border-dashed border-primary/25"
            />

            {/* Même cadre que l'accueil : l'illustration garde son
                intégralité, le cadre lui donne une assise. */}
            <div className="relative aspect-square w-full animate-float-slow rounded-[28px] border border-primary/25 bg-[var(--bg-card)] p-2 shadow-[0_0_70px_-20px_rgba(212,175,55,0.55),var(--shadow-card)] transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-[#0d0d0d]">
                {profile.aboutPhotoUrl || profile.photoUrl ? (
                  <Image
                    src={(profile.aboutPhotoUrl || profile.photoUrl) as string}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 28rem"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-accent to-accent2 font-display text-8xl font-black text-[#14120b]">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeIn("left", "tween", 0.2, 0.9)}
          className="space-y-8"
        >
          <p className="max-w-3xl text-[17px] leading-[30px] text-[var(--text-secondary)]">
            {profile.bio}
          </p>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-1 text-xs text-[var(--text-muted)] md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          {profile.cvUrl && (
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">
                <Download className="h-4 w-4" /> Télécharger mon CV
              </Button>
            </a>
          )}
        </motion.div>
      </div>
    </SectionShell>
  );
}
