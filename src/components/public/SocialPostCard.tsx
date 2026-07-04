import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { platformColor, formatDate } from "@/lib/utils";
import type { SocialPost } from "@prisma/client";

export function SocialPostCard({ post }: { post: SocialPost }) {
  const color = platformColor(post.platform);

  return (
    <Card hover className="group flex flex-col overflow-hidden">
      {post.thumbnailUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {post.platform}
        </span>
        <h3 className="font-display text-base font-semibold text-[var(--text-primary)] [overflow-wrap:anywhere]">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--text-secondary)]">
            {post.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="text-xs text-[var(--text-muted)]">
            {formatDate(post.publishedAt)}
          </span>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Voir la publication <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
