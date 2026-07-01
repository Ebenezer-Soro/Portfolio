"use client";

import { Menu, ExternalLink, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminHeader({
  onMenu,
  userName,
}: {
  onMenu: () => void;
  userName?: string | null;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Drapeau d'hydratation (pattern next-themes) : setState volontaire au montage.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-[80] flex h-16 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 lg:px-8">
      <button
        onClick={onMenu}
        aria-label="Ouvrir le menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-[var(--text-muted)]">
          Bonjour{userName ? `, ${userName}` : ""} 👋
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Basculer le thème"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-primary"
          >
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        )}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-primary"
        >
          <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Voir le site</span>
        </Link>
      </div>
    </header>
  );
}
