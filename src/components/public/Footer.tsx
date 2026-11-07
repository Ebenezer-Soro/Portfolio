import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "./SocialLinks";
import type { Profile, SocialLink } from "@prisma/client";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projets" },
  { label: "Publications", href: "/publications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Footer({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-lg font-display text-sm font-bold text-primary",
              /* Le logo chargé depuis l'admin porte son propre fond — c'est
                 la tuile carrée du kit, la même que l'icône d'onglet. L'encadrer
                 une seconde fois donnerait deux cadres imbriqués : le fond teinté
                 et la bordure ne servent donc qu'au repli en initiales. */
                profile.logoUrl ? "" : "border border-primary/45 bg-primary/[0.08]",
              )}
            >
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
              <span className="font-display text-base font-bold tracking-[-0.015em] text-[var(--text-primary)]">
                {profile.name}
              </span>
              <span className="mono-label text-[9px]">{profile.title}</span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {profile.location
              ? `Des plateformes web conçues, développées et déployées depuis ${profile.location} — pour des clients partout.`
              : "Des plateformes web conçues, développées et déployées de bout en bout."}
          </p>

          <div className="mt-5">
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        <div>
          <h3 className="mono-label mb-4 text-[10px]">Navigation</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[15px] text-[var(--text-secondary)] transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mono-label mb-4 text-[10px]">Contact</h3>
          <ul className="space-y-2.5 text-[15px] text-[var(--text-secondary)]">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="transition-colors hover:text-primary">
                  {profile.email}
                </a>
              </li>
            )}
            {profile.phone && (
              <li>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-primary"
                >
                  {profile.phone}
                </a>
              </li>
            )}
            {profile.location && <li>{profile.location}</li>}
          </ul>
          {profile.isAvailable && (
            <p className="mono-label mt-5 text-[10px] text-primary">Ouvert aux nouveaux projets</p>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        {/* Aucun lien vers l'administration : elle ne doit laisser aucune
            trace dans le rendu public. L'accès se fait au clavier (voir
            AdminShortcut) ou par l'URL directe. */}
        <div className="container-page flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-[10px]">
            © {year} {profile.name} — Tous droits réservés
          </p>
          <p className="mono-label text-[10px]">Conçu et développé sur mesure</p>
        </div>
      </div>
    </footer>
  );
}
