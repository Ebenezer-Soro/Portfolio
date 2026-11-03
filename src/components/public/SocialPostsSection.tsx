"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SocialPostCard } from "./SocialPostCard";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SocialPost } from "@prisma/client";

export function SocialPostsSection({ posts, index }: { posts: SocialPost[]; index?: string }) {
  const platforms = useMemo(
    () => ["Toutes", ...Array.from(new Set(posts.map((p) => p.platform)))],
    [posts],
  );
  const [filter, setFilter] = useState("Toutes");

  if (!posts.length) return null;

  const filtered = filter === "Toutes" ? posts : posts.filter((p) => p.platform === filter);

  return (
    <SectionShell id="publications">
        <SectionHeading
          index={index ?? "07"}
          eyebrow="Publications"
          title="Ce que je partage, et où."
          description="Mes derniers partages sur les réseaux professionnels, rassemblés en un seul endroit."
          align="left"
        />

        <div className="rangee-filtres mb-10 sm:justify-center">
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
          {filtered.slice(0, 6).map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/publications">
            <Button variant="outline" size="lg">
              Toutes les publications <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
  );
}
