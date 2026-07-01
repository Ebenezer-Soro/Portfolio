import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@prisma/client";

export function BlogCard({ post }: { post: Post }) {
  return (
    <Card hover className="group flex flex-col overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
            <span className="font-display text-3xl font-bold text-gradient">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--text-secondary)]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime ?? 3} min
          </span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lire l’article <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
