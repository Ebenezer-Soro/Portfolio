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
 * En-tête de section — la planche de dessin.
 *
 * Trois éléments : un index numéroté en monospace, un filet d'accent,
 * puis le titre. Le chapeau est décalé à droite au-delà de 900 px :
 * c'est ce décalage qui donne l'allure « planche cotée » plutôt que
 * « page centrée ».
 *
 * L'animation est autoportée (`whileInView`) : l'en-tête se comporte de
 * la même façon qu'il soit ou non placé dans un conteneur
 * d'échelonnement.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  /** Numéro de section, « 01 » à « 11 ». Purement typographique. */
  index?: string;
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
      className={cn("mb-10 sm:mb-16", align === "center" && "text-center", className)}
    >
      {(index || eyebrow) && (
        <div
          className={cn(
            "mb-5 flex items-center gap-4",
            align === "center" && "justify-center",
          )}
        >
          {index && <span className="mono-label text-primary">{index}</span>}
          <span
            aria-hidden
            className="h-0.5 w-[clamp(2rem,8vw,5rem)] rounded-sm bg-[image:var(--nappe-accent)]"
          />
          {eyebrow && <span className="mono-label">{eyebrow}</span>}
        </div>
      )}

      <div
        className={cn(
          "grid items-end gap-4",
          align === "left" && "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12",
          align === "center" && "mx-auto max-w-3xl",
        )}
      >
        <h2 className="section-head-text text-[var(--text-primary)]">{title}</h2>
        {description && (
          <p
            className={cn(
              "text-[17px] leading-[30px] text-[var(--text-secondary)]",
              align === "left" && "lg:pb-1.5",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
