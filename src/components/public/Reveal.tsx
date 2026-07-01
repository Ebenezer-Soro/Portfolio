"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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
  return (
    <div
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-[0_0_24px_rgba(14,165,233,0.18)] backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <div
        className={cn(
          "mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-primary via-accent to-accent2 bg-[length:200%_auto] animate-gradient",
          align === "center" && "mx-auto",
        )}
      />
      {description && (
        <p className="mt-5 text-base text-[var(--text-secondary)] md:text-lg">{description}</p>
      )}
    </div>
  );
}
