"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Drapeau d'hydratation (pattern next-themes) : setState volontaire au montage.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark");
  const sombre = (resolvedTheme ?? theme) === "dark";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "glass border-[var(--border)]" : "border-transparent bg-transparent",
        )}
      >
        <nav
          className={cn(
            "container-page flex items-center justify-between gap-4 transition-[height] duration-300",
            scrolled ? "h-16" : "h-[4.75rem]",
          )}
          aria-label="Navigation principale"
        >
          <Link href="/" className="group flex items-center gap-3" aria-label="Accueil">
            <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-lg border border-primary/45 bg-primary/[0.08] font-display text-sm font-bold text-primary transition-shadow group-hover:shadow-[var(--glow-primary)]">
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name.slice(0, 2).toUpperCase()
              )}
            </span>
            <span className="flex flex-col leading-[1.15]">
              <span className="whitespace-nowrap font-display text-base font-bold tracking-[-0.015em] text-[var(--text-primary)]">
                {profile.name}
              </span>
              <span className="mono-label hidden whitespace-nowrap text-[9px] sm:block">
                {profile.title}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative block rounded-sm px-3 py-2 text-[15px] font-medium transition-colors",
                      active ? "text-primary" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {item.label}
                    {/* L'indicateur est un trait de 2 px sous le lien,
                        non une pastille : la même grammaire que les
                        filets de la page. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-sm bg-primary transition-transform duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label={sombre ? "Passer au thème clair" : "Passer au thème sombre"}
                className="grid h-[2.625rem] w-[2.625rem] place-items-center rounded-lg border border-[var(--border)] bg-[image:var(--nappe)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-all hover:-translate-y-px hover:border-primary hover:text-primary"
              >
                {sombre ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            <Link href="/contact" className="hidden lg:block">
              <Button size="sm" variant="primary">
                Parlons-en
                <span className="rond" aria-hidden>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Button>
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="tiroir-navigation"
              className="grid h-[2.625rem] w-[2.625rem] place-items-center rounded-lg border border-[var(--border)] bg-[image:var(--nappe)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-all hover:border-primary hover:text-primary lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Tiroir mobile : plein écran sous l'en-tête. */}
      <div
        id="tiroir-navigation"
        className={cn(
          "fixed inset-x-0 top-[4.75rem] z-[99] max-h-[calc(100vh-4.75rem)] overflow-y-auto border-b border-[var(--border)] bg-[var(--bg-primary)] shadow-[var(--shadow-lg)] transition-all duration-[240ms] lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <ul className="container-page py-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "block border-b border-[var(--border)] py-3.5 font-display text-lg font-semibold tracking-[-0.015em] transition-colors",
                  isActive(item.href) ? "text-primary" : "text-[var(--text-primary)] hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
