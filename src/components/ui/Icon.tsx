import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

export interface IconProps extends LucideProps {
  name: string;
  fallback?: IconName;
}

/** Rend une icône lucide-react par son nom (ex: "ShieldCheck"). */
export function Icon({ name, fallback = "Sparkles", ...props }: IconProps) {
  const Cmp =
    (LucideIcons[name as IconName] as React.ComponentType<LucideProps>) ??
    (LucideIcons[fallback] as React.ComponentType<LucideProps>);
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
