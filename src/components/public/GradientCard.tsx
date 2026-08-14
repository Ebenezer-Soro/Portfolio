import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Carte à bordure dégradée 1px — la carte signature du modèle.
 *
 * L'enveloppe porte le dégradé teal → magenta et 1px de padding ; la surface
 * intérieure, opaque, ne laisse apparaître que le liseré. C'est plus net
 * qu'une `border-image`, qui ne suit pas les coins arrondis sur tous les
 * navigateurs.
 */
export function GradientCard({
  children,
  className,
  innerClassName,
  radius = "rounded-[20px]",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  radius?: string;
}) {
  return (
    <div className={cn("green-pink-gradient p-px shadow-card", radius, className)}>
      <div className={cn("h-full w-full bg-[var(--bg-card)]", radius, innerClassName)}>
        {children}
      </div>
    </div>
  );
}
