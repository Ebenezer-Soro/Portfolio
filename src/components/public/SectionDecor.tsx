import { cn } from "@/lib/utils";

/**
 * Décor d'arrière-plan d'une section : voile coloré + orbes dégradés flous
 * flottants + grille subtile. Plus présent en mode clair (le mode sombre
 * conserve un rendu discret). À placer dans une section `relative overflow-hidden`.
 */
export function SectionDecor({
  variant = "primary",
  grid = true,
}: {
  variant?: "primary" | "accent";
  grid?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {grid && (
        <div
          className="absolute inset-0 opacity-70 dark:opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage: "radial-gradient(ellipse 85% 65% at 50% 35%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 65% at 50% 35%, black, transparent 78%)",
          }}
        />
      )}

      {/* Voile dégradé coloré — uniquement en mode clair */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage:
            variant === "primary"
              ? "radial-gradient(70% 55% at 15% 0%, rgba(14,165,233,0.10), transparent 60%), radial-gradient(70% 55% at 85% 100%, rgba(99,102,241,0.09), transparent 60%)"
              : "radial-gradient(70% 55% at 85% 0%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(70% 55% at 15% 100%, rgba(139,92,246,0.09), transparent 60%)",
        }}
      />

      {/* Orbes flous flottants — plus marqués en clair */}
      <div
        className={cn(
          "absolute -left-28 top-0 h-80 w-80 animate-float-slow rounded-full blur-3xl",
          variant === "primary"
            ? "bg-primary/25 dark:bg-primary/10"
            : "bg-accent/25 dark:bg-accent/10",
        )}
      />
      <div
        className={cn(
          "absolute -right-28 bottom-0 h-96 w-96 animate-float rounded-full blur-3xl",
          variant === "primary"
            ? "bg-accent/20 dark:bg-accent/10"
            : "bg-accent2/20 dark:bg-accent2/10",
        )}
        style={{ animationDelay: "1.5s" }}
      />
    </div>
  );
}
