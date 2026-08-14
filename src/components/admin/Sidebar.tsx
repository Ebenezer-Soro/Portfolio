"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Wrench,
  GraduationCap,
  Briefcase,
  PenLine,
  MessageSquareQuote,
  Globe,
  Mail,
  Image as ImageIcon,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Le menu est groupé : treize entrées à plat sont pénibles à balayer. */
const GROUPES = [
  {
    titre: "Pilotage",
    items: [
      { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/admin/messages", label: "Messages", icon: Mail, badge: "messages" },
      { href: "/admin/medias", label: "Médiathèque", icon: ImageIcon },
    ],
  },
  {
    titre: "Contenu",
    items: [
      { href: "/admin/projets", label: "Projets", icon: FolderKanban },
      { href: "/admin/blog", label: "Blog", icon: PenLine },
      { href: "/admin/reseaux", label: "Réseaux & Publications", icon: Globe },
      { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    titre: "Profil",
    items: [
      { href: "/admin/profil", label: "Mon profil", icon: User },
      { href: "/admin/competences", label: "Compétences", icon: Wrench },
      { href: "/admin/experiences", label: "Expériences", icon: GraduationCap },
      { href: "/admin/services", label: "Services", icon: Briefcase },
    ],
  },
  {
    titre: "Système",
    items: [{ href: "/admin/parametres", label: "Paramètres", icon: Settings }],
  },
] as const;

export function Sidebar({
  unreadCount = 0,
  open,
  onClose,
}: {
  unreadCount?: number;
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-[#171a23]/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        // `min(16rem, 82vw)` : à 320 px de large, un tiroir fixe de 256 px ne
        // laisserait presque rien voir de la page en dessous.
        className={cn(
          "fixed inset-y-0 left-0 z-[95] flex w-[min(16rem,82vw)] flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform duration-300 lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navigation de l'administration"
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-[var(--border)] px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent2 text-lg font-bold text-white">
            S
          </span>
          <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[var(--text-primary)]">
            Administration
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          {GROUPES.map((groupe) => (
            <div key={groupe.titre} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {groupe.titre}
              </p>
              <ul className="space-y-0.5">
                {groupe.items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-primary/10 font-semibold text-primary"
                            : "font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {"badge" in item && item.badge === "messages" && unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-[var(--border)] p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-[18px] w-[18px]" /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
