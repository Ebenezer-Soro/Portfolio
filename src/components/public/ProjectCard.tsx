import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Project } from "@prisma/client";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <Link href={`/projets/${project.slug}`} className="relative block aspect-video overflow-hidden">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-accent2/20">
            <span className="font-display text-3xl font-bold text-gradient">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {project.featured && (
          <Badge variant="accent" className="absolute left-3 top-3 backdrop-blur">
            ★ À la une
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <Link href={`/projets/${project.slug}`}>
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-primary [overflow-wrap:anywhere]">
            {project.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="font-mono text-xs text-[var(--text-muted)]">
              #{tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-4">
          <Link
            href={`/projets/${project.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Détails <ArrowUpRight className="h-4 w-4" />
          </Link>
          <span className="flex-1" />
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Démo en ligne"
              className="-m-2 flex items-center justify-center p-2 text-[var(--text-muted)] transition-colors hover:text-primary"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Code source"
              className="-m-2 flex items-center justify-center p-2 text-[var(--text-muted)] transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
