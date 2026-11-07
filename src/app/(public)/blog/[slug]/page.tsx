import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getProfile } from "@/lib/queries";
import { Badge } from "@/components/ui/Badge";
import { TiptapRenderer } from "@/components/public/TiptapRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getPostBySlug(slug), getProfile()]);
  if (!post) return { title: "Article introuvable" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(post.coverUrl);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    // `type: "article"` et les deux dates : sans elles, les réseaux et
    // Google Discover présentent la page comme un site, sans date ni
    // auteur. L'image doit être absolue — une URL relative est ignorée
    // par les aperçus.
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [profile.name],
      tags: post.tags,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt ?? undefined,
      ...(image ? { images: [image] } : {}),
    },
    ...(post.tags.length ? { keywords: post.tags } : {}),
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getPostBySlug(slug), getProfile()]);
  if (!post || !post.published) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(absoluteUrl(post.coverUrl) ? { image: absoluteUrl(post.coverUrl) } : {}),
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: profile.name, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "fr-FR",
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
    publisher: { "@type": "Person", name: profile.name, url: SITE_URL },
  };

  /*
   * Fil d'Ariane : il ne s'affiche pas sur la page, il sert au résultat
   * de recherche, qui remplace alors l'URL brute par
   * « Accueil › Blog › Titre ».
   */
  const filLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <article className="container-page max-w-3xl pt-32 pb-20">
      <JsonLd data={articleLd} />
      <JsonLd data={filLd} />
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

      <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl [overflow-wrap:anywhere]">
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
