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
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profil", label: "Mon Profil", icon: User },
  { href: "/admin/projets", label: "Projets", icon: FolderKanban },
  { href: "/admin/competences", label: "Compétences", icon: Wrench },
  { href: "/admin/experiences", label: "Expériences", icon: GraduationCap },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: PenLine },
  { href: "/admin/temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/reseaux", label: "Réseaux & Publications", icon: Globe },
  { href: "/admin/messages", label: "Messages", icon: Mail, badgeKey: "messages" },
  { href: "/admin/medias", label: "Médiathèque", icon: ImageIcon },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

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
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[95] flex w-64 flex-col bg-[#0d1320] text-slate-300 transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent font-display text-lg font-bold text-white">
            K
          </span>
          <span className="font-display text-base font-bold text-white">King Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "border-primary bg-primary/10 text-white"
                        : "border-transparent text-slate-400 hover:bg-white/5 hover:text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badgeKey === "messages" && unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-5 w-5" /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
