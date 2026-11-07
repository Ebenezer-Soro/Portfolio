"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

/**
 * Carte de projet — une PLANCHE D'APERÇU.
 *
 * Au repos, la capture est mise en sourdine (voile uni, couleurs
 * désaturées, voir `.chassis` dans globals.css) : une capture d'écran
 * est une image très claire et très bavarde, et trois côte à côte ne
 * forment plus un ensemble. Au survol, un châssis de navigateur
 * descend, la capture reprend ses couleurs et glisse vers le haut —
 * l'aperçu s'allume quand on s'y intéresse.
 *
 * La variante `large` place le visuel et le récit côte à côte : une
 * capture en pleine largeur écrasait la page.
 */
export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const hote = (() => {
    const url = project.demoUrl ?? project.repoUrl;
    if (!url) return null;
    try {
      return new URL(url).host.replace(/^www\./, "");
    } catch {
      return null;
    }
  })();

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[var(--shadow-lg),var(--glow-primary)]",
        large && "md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-stretch",
      )}
    >
      <div
        className={cn(
          "chassis relative",
          large
            ? "aspect-[16/10] md:aspect-auto md:h-full md:border-b-0 md:border-r md:border-[var(--border)]"
            : "aspect-[16/10] border-b border-[var(--border)]",
        )}
      >
        {hote && (
          <div className="barre-chassis" aria-hidden>
            <span className="flex gap-1">
              <i className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
              <i className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
              <i className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
            </span>
            <span className="truncate font-mono text-[9px] tracking-[0.06em] text-[var(--text-muted)]">
              {hote}
            </span>
          </div>
        )}

        <Link href={`/projets/${project.slug}`} className="absolute inset-0 z-[1]">
          {project.coverUrl ? (
            /* L'alternative textuelle porte ici le nom du lien : une
               image de couverture est du contenu, pas une décoration, et
               c'est par ce texte qu'elle est trouvée dans la recherche
               d'images. Le doublon `sr-only` est donc réservé au cas sans
               couverture, où il n'y a aucun autre texte. */
            <Image
              src={project.coverUrl}
              alt={`${project.title} — aperçu du projet`}
              fill
              sizes={large ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, 420px"}
              className={cn("object-cover", large ? "object-left-top" : "object-top")}
            />
          ) : (
            <span className="grid h-full w-full place-items-center bg-[image:linear-gradient(135deg,rgb(var(--c-primary)/0.14),transparent_60%)] font-display text-4xl font-bold text-[var(--border-strong)]">
              <span className="sr-only">{project.title}</span>
              <span aria-hidden>{project.title.charAt(0)}</span>
            </span>
          )}
        </Link>

        <div className="card-img_hover pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex gap-2 p-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Démo en ligne de ${project.title}`}
              className="pointer-events-auto inline-flex h-9 items-center gap-2 rounded-lg bg-[image:var(--nappe-accent)] px-3.5 font-display text-sm font-semibold text-white shadow-[var(--lueur-accent)]"
            >
              Site en ligne <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Code source de ${project.title}`}
              className="black-gradient pointer-events-auto grid h-9 w-9 place-items-center rounded-lg text-white transition-transform hover:scale-110"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-4 p-6",
          large && "md:justify-center md:p-[clamp(1.75rem,1.2rem+1.4vw,2.75rem)]",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="mono-label text-[10px]">
            {new Date(project.createdAt).getFullYear()}
            {project.tags[0] ? ` · ${project.tags[0]}` : ""}
          </span>
          {project.featured && (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.06em] text-primary">
              À la une
            </span>
          )}
        </div>

        <Link href={`/projets/${project.slug}`}>
          <h3
            className={cn(
              "font-display font-bold tracking-[-0.02em] text-[var(--text-primary)] transition-colors [overflow-wrap:anywhere] group-hover:text-primary",
              large ? "text-2xl md:text-3xl" : "text-2xl",
            )}
          >
            {project.title}
          </h3>
        </Link>

        <p className="text-[15px] leading-[1.65] text-[var(--text-secondary)]">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.techStack.slice(0, large ? 8 : 4).map((tech) => (
            <span
              key={tech}
              className="rounded-sm border border-[var(--border)] bg-[var(--surface-deep)] px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-[var(--text-secondary)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
