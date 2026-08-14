"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Effet d'inclinaison au survol, façon `react-tilt` du modèle.
 *
 * La bibliothèque d'origine (react-tilt) n'est plus maintenue et n'est pas
 * compatible React 19 ; l'effet tient en quelques lignes, on évite donc une
 * dépendance de plus. Le pointeur pilote une rotation 3D bornée, et le tout
 * est neutralisé au clavier et pour `prefers-reduced-motion` — un survol
 * décoratif ne doit jamais gêner la lecture.
 */
export function TiltCard({
  children,
  className,
  max = 12,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  /** Inclinaison maximale en degrés. */
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    // Coordonnées normalisées dans [-0.5, 0.5] depuis le centre de la carte.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    setTransform(
      `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`,
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform(undefined)}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn(
        "transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
