"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Boutons de la direction artistique : plus hauts, plus épais, coins
 * arrondis mais francs. Le bouton plein porte un dégradé et une ombre
 * colorée — c'est la seule zone franchement lumineuse de la page, et
 * elle doit appeler le clic.
 *
 * Le bleu supporte le texte blanc dans les deux thèmes (4,6:1 sur
 * #2e7dff, 7:1 sur #1554d6) : contrairement à l'or de la version
 * précédente, aucun aplat n'a besoin d'être retourné en texte sombre.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-display font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--nappe-accent)] text-white shadow-[var(--lueur-accent)] hover:shadow-[var(--lueur-accent),0_0_0_4px_rgb(var(--c-primary)/0.16)]",
        gradient:
          "bg-[image:var(--nappe-accent)] text-white shadow-[var(--lueur-accent)] hover:shadow-[var(--lueur-accent),0_0_0_4px_rgb(var(--c-primary)/0.16)]",
        secondary:
          "bg-[image:var(--nappe)] text-[var(--text-primary)] border border-[var(--border-strong)] shadow-[var(--shadow-sm)] hover:border-primary hover:text-primary",
        outline:
          "bg-[image:var(--nappe)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-primary hover:text-primary hover:shadow-[var(--shadow-md)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
        danger: "bg-danger text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
