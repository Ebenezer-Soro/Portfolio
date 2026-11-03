"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      // Première visite : on suit la préférence du système. Les deux
      // thèmes sont conçus avec le même soin ; imposer le sombre
      // revenait à décider pour le visiteur, et à ne jamais montrer la
      // moitié du travail. Le choix manuel, lui, est mémorisé.
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
