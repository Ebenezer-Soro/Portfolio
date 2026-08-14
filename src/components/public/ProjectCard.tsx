"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "./TiltCard";
import type { Project } from "@prisma/client";

/** Teinte des mots-clés, façon `tag.color` du modèle (rotation stable). */
const TEINTES = [
  "blue-text-gradient",
  "green-text-gradient",
  "pink-text-gradient",
  "orange-text-gradient",
] as const;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full">
      <article className="group flex h-full flex-col rounded-2xl bg-[var(--bg-card)] p-5 shadow-card">
        <div className="relative h-[230px] w-full overflow-hidden rounded-2xl">
          <Link href={`/projets/${project.slug}`} className="absolute inset-0 z-0">
            {project.coverUrl ? (
              <Image
                src={project.coverUrl}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-accent/25 to-accent2/25">
                <span className="text-gradient font-display text-4xl font-black">
                  {project.title.charAt(0)}
                </span>
              </span>
            )}
          </Link>

          {project.featured && (
            <Badge variant="accent" className="absolute left-3 top-3 z-10 backdrop-blur">
              ★ À la une
            </Badge>
          )}

          {/* Pastilles d'action révélées au survol (card-img_hover du modèle) */}
          <div className="card-img_hover pointer-events-none absolute inset-0 z-10 m-3 flex justify-end gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Démo en ligne de ${project.title}`}
                className="black-gradient pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
              >
                <ExternalLink className="h-[18px] w-[18px]" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Code source de ${project.title}`}
                className="black-gradient pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
              >
                <Github className="h-[18px] w-[18px]" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          {project.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Link href={`/projets/${project.slug}`}>
            <h3 className="font-display text-[24px] font-bold text-[var(--text-primary)] transition-colors group-hover:text-primary [overflow-wrap:anywhere]">
              {project.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech, i) => (
              <span
                key={tech}
                className={`text-[14px] font-medium ${TEINTES[i % TEINTES.length]}`}
              >
                #{tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
