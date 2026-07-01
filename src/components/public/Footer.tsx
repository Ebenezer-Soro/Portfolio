import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "./SocialLinks";
import type { Profile, SocialLink } from "@prisma/client";

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
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
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
            <span className="font-display text-base font-bold text-[var(--text-primary)]">
              {profile.name}
            </span>
          </Link>
          <p className="max-w-xs text-sm text-[var(--text-secondary)]">{profile.title}</p>
          <SocialLinks links={socialLinks} />
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">
            Navigation
          </h3>
          <ul className="space-y-2">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-primary">
                  {profile.email}
                </a>
              </li>
            )}
            {profile.phone && (
              <li>
                <a href={`tel:${profile.phone}`} className="hover:text-primary">
                  {profile.phone}
                </a>
              </li>
            )}
            {profile.location && <li>{profile.location}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>
            © {year} {profile.name}. Tous droits réservés.
          </p>
          <Link href="/admin/login" className="transition-colors hover:text-primary">
            Espace admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
