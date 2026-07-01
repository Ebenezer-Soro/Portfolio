import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { TiptapRenderer } from "@/components/public/TiptapRenderer";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverUrl ? { images: [post.coverUrl] } : undefined,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <article className="container-page max-w-3xl pt-32 pb-20">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" /> {formatDate(post.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> {post.readingTime ?? 3} min de lecture
        </span>
      </div>

      {post.coverUrl && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-[var(--border)]">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-10">
        <TiptapRenderer content={post.content} />
      </div>
    </article>
  );
}
