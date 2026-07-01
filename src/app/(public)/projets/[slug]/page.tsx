import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getProjectBySlug } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TiptapRenderer } from "@/components/public/TiptapRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.title,
    description: project.description,
    openGraph: project.coverUrl ? { images: [project.coverUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();

  return (
    <article className="container-page max-w-4xl pt-32 pb-20">
      <Link
        href="/projets"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux projets
      </Link>

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-[var(--text-secondary)]">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">
              <ExternalLink className="h-4 w-4" /> Voir la démo
            </Button>
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              <Github className="h-4 w-4" /> Code source
            </Button>
          </a>
        )}
      </div>

      {project.coverUrl && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-[var(--border)]">
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.techStack.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Stack technique
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="neutral" size="md">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {project.content && (
        <div className="mt-10">
          <TiptapRenderer content={project.content} />
        </div>
      )}

      {project.images.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {project.images.map((img, i) => (
            <div key={i} className="relative aspect-video overflow-hidden rounded-xl border border-[var(--border)]">
              <Image
                src={img}
                alt={`${project.title} — capture ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
