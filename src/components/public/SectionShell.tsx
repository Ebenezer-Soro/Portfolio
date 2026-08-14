"use client";

import { motion, useReducedMotion } from "framer-motion";
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
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const reduce = useReducedMotion();

  return (
    // Pas d'`overflow` ici : `overflow-x: clip` forcerait `overflow-y` à
    // `clip` (une valeur `visible` accolée à `clip` devient `clip`), ce qui
    // tranche l'encre des glyphes débordant de leur boîte de ligne — hampes
    // et accents des grands titres. Le débordement horizontal est déjà géré
    // sur `body`.
    <section id={id} className={cn("relative z-0 scroll-mt-24", className)}>
      <motion.div
        variants={reduce ? undefined : staggerContainer(stagger, delayChildren)}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.2 }}
        className={cn(
          "mx-auto max-w-7xl px-6 py-10 sm:px-16 sm:py-16",
          innerClassName,
        )}
      >
        {children}
      </motion.div>
    </section>
  );
}
