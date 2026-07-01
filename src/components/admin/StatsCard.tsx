import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatsCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "primary" | "accent" | "success" | "danger";
}) {
  const accents: Record<string, string> = {
    primary: "from-primary to-accent",
    accent: "from-accent to-accent2",
    success: "from-success to-emerald-400",
    danger: "from-danger to-orange-400",
  };

  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
          accents[accent],
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="truncate text-sm text-[var(--text-secondary)]">{label}</p>
        {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    </div>
  );
}
