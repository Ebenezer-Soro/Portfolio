"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/motion";

/**
 * Coquille de section — équivalent du `SectionWrapper` (HOC) du modèle.
 *
 * Elle pose la largeur et les marges communes, l'ancre de navigation, et le
 * conteneur d'échelonnement qui déclenche la cascade des enfants à l'entrée
 * dans le viewport.
 *
 * L'ancre est portée par la section elle-même, décalée via `scroll-mt` pour
 * que la navbar fixe ne recouvre pas le titre visé. Surtout PAS l'astuce
 * `hash-span` du modèle (un `<span>` en `-mt-[100px]` / `pb-[100px]`) : elle
 * ne tient que parce que le modèle met son padding sur la `<section>`. Ici le
 * padding est sur le div interne, donc la marge négative du premier enfant
 * fusionne avec celle de la section et tire chaque section 100 px vers le
 * haut — chacune recouvrait alors le bas de la précédente.
 */
export function SectionShell({
  id,
  children,
  className,
  innerClassName,
  stagger = 0.12,
  delayChildren = 0,
  plage = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  stagger?: number;
  delayChildren?: number;
  /** Pose le contenu sur un grand panneau arrondi. Une section sur
   *  deux en porte un : c'est ce qui donne son rythme à la page. */
  plage?: boolean;
}) {

  return (
    // Pas d'`overflow` ici : `overflow-x: clip` forcerait `overflow-y` à
    // `clip` (une valeur `visible` accolée à `clip` devient `clip`), ce qui
    // tranche l'encre des glyphes débordant de leur boîte de ligne — hampes
    // et accents des grands titres. Le débordement horizontal est déjà géré
    // sur `body`.
    <section id={id} className={cn("relative z-0 scroll-mt-24", className)}>
      <motion.div
        variants={staggerContainer(stagger, delayChildren)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={cn(
          // Le confinement est porté par le conteneur d'animation, jamais par
          // la <section> : celle-ci n'a aucun rembourrage, découper à son bord
          // trancherait l'encre des titres. Ici les 24 px de `px-6` et les
          // 40 px de `py-10` offrent déjà une réserve, doublée par
          // `overflow-clip-margin`.
          "piste-animee mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,0.9rem+1.6vw,2.5rem)] py-[var(--space-16)]",
          innerClassName,
        )}
      >
        {plage ? <div className="plage">{children}</div> : children}
      </motion.div>
    </section>
  );
}
