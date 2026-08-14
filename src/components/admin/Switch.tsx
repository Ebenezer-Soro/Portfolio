"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  label,
  id,
  // Nom accessible quand l'interrupteur n'a pas de `label` visible à lui :
  // sans cela, un lecteur d'écran annonce un bouton sans intitulé.
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
      <SwitchPrimitive.Root
        id={id}
        aria-label={label ? undefined : ariaLabel}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-[var(--border)]",
        )}
      >
        <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
      </SwitchPrimitive.Root>
      {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
    </label>
  );
}
