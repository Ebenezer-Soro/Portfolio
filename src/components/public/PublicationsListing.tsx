"use client";

import { useMemo, useState } from "react";
import { SocialPostCard } from "./SocialPostCard";
import { cn } from "@/lib/utils";
import type { SocialPost } from "@prisma/client";

export function PublicationsListing({ posts }: { posts: SocialPost[] }) {
  const platforms = useMemo(
    () => ["Toutes", ...Array.from(new Set(posts.map((p) => p.platform)))],
    [posts],
  );
  const [filter, setFilter] = useState("Toutes");

  if (!posts.length) {
    return (
      <p className="py-20 text-center text-[var(--text-muted)]">
        Aucune publication pour le moment.
      </p>
    );
  }

  const filtered = filter === "Toutes" ? posts : posts.filter((p) => p.platform === filter);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              filter === p
                ? "bg-primary text-white shadow-[var(--shadow-sky)]"
                : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-primary",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <SocialPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
