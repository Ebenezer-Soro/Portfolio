"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({ src, alt = "", fallback, className }: AvatarProps) {
  const initials =
    fallback ??
    alt
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--bg-secondary)]",
        className,
      )}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
        {initials || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
