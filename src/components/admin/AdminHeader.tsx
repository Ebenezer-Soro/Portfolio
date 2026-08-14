"use client";

import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";

export function AdminHeader({
  onMenu,
  userName,
}: {
  onMenu: () => void;
  userName?: string | null;
}) {
  // Pas de bascule de thème ici : le back-office est volontairement figé en
  // clair (cf. .admin-scope). Un interrupteur sans effet induirait en erreur.
  return (
    <header className="sticky top-0 z-[80] flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-3 backdrop-blur sm:px-4 lg:px-8">
      <button
        onClick={onMenu}
        aria-label="Ouvrir le menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <p className="min-w-0 flex-1 truncate text-sm text-[var(--text-secondary)]">
        <span className="hidden sm:inline">Bonjour</span>
        {userName ? (
          <span className="font-semibold text-[var(--text-primary)]">
            <span className="hidden sm:inline">, </span>
            {userName}
          </span>
        ) : null}
      </p>

      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-primary/40 hover:text-primary sm:px-3"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="hidden sm:inline">Voir le site</span>
      </Link>
    </header>
  );
}
