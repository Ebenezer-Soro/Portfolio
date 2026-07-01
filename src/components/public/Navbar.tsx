"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@prisma/client";

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projets" },
  { label: "Publications", href: "/publications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ profile }: { profile: Profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Au-dessus du hero sombre (haut de la page d'accueil) : texte clair.
  const onHero = !scrolled && pathname === "/";

  // Détermine si un lien correspond à la page courante.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Drapeau d'hydratation (pattern next-themes) : setState volontaire au montage.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
        scrolled
          ? "glass border-b border-[var(--border)] py-3 shadow-[var(--shadow-md)]"
          : "border-b border-transparent bg-transparent py-5",
      )}
    >
      <nav className="container-page flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Accueil">
          {profile.logoUrl ? (
            <Image
              src={profile.logoUrl}
              alt={profile.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent font-display text-lg font-bold text-white">
              {profile.name.charAt(0)}
            </span>
          )}
          <span
            className={cn(
              "font-display text-base font-bold transition-colors",
              onHero ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            {profile.name}
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    onHero
                      ? active
                        ? "bg-white/15 text-white"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-primary/10 text-primary"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-primary",
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full",
                        onHero ? "bg-white" : "bg-primary",
                      )}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                onHero
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-primary",
              )}
            >
              {(resolvedTheme ?? theme) === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
          {profile.cvUrl && (
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="hidden md:block">
              <Button size="sm" variant="gradient">
                CV
              </Button>
            </a>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors md:hidden",
              onHero
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:text-primary",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="glass mt-3 border-t border-[var(--border)] md:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "border-l-2 border-primary bg-primary/10 text-primary"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
