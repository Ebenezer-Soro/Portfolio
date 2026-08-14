"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { textVariant } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Enveloppe un bloc et le révèle (fade-in-up) à l'entrée dans le viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const { ref } = useScrollAnimation<HTMLDivElement>(threshold);
  return (
    <Tag
      // @ts-expect-error ref générique sur élément polymorphe
      ref={ref}
      data-animate
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * En-tête de section au format du modèle : sur-titre en capitales espacées,
 * puis un titre très gras et très grand. Pas de filet décoratif — dans le
 * modèle, c'est le contraste d'échelle entre les deux lignes qui structure
 * la page.
 *
 * L'animation est autoportée (`whileInView`) : l'en-tête se comporte de la
 * même façon qu'il soit ou non placé dans un conteneur d'échelonnement.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-section-heading
      variants={reduce ? undefined : textVariant()}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left",
        className,
      )}
    >
      {eyebrow && <p className="section-sub-text">{eyebrow}</p>}
      <h2 className="section-head-text mt-2 text-[var(--text-primary)]">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-3xl text-[17px] leading-[30px] text-[var(--text-secondary)]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
