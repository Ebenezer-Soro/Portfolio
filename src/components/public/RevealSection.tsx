"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export type RevealVariant = "up" | "left" | "right" | "zoom";

const VARIANTS: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 90, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  left: {
    hidden: { opacity: 0, x: -140, filter: "blur(10px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  right: {
    hidden: { opacity: 0, x: 140, filter: "blur(10px)" },
    show: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.82, filter: "blur(12px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
};

/**
 * Révèle une section façon "transition de diapositive" quand elle entre
 * dans le viewport : fondu + glissement/zoom + flou. Direction variable.
 */
export function RevealSection({
  children,
  variant = "up",
}: {
  children: ReactNode;
  variant?: RevealVariant;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    // Le glissement horizontal (x: ±140) déborderait la largeur du viewport sur
    // mobile → on clippe l'axe X ici pour éviter tout scroll horizontal parasite.
    // `clip` (et non `hidden`) laisse l'axe vertical intact et ne crée pas de
    // conteneur de défilement.
    <div className="overflow-x-clip">
      <motion.div
        variants={VARIANTS[variant]}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
