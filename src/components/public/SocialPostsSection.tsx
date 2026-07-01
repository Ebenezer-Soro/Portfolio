"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SocialPostCard } from "./SocialPostCard";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { SocialPost } from "@prisma/client";

export function SocialPostsSection({ posts }: { posts: SocialPost[] }) {
  const platforms = useMemo(
    () => ["Toutes", ...Array.from(new Set(posts.map((p) => p.platform)))],
    [posts],
  );
  const [filter, setFilter] = useState("Toutes");

  if (!posts.length) return null;

  const filtered = filter === "Toutes" ? posts : posts.filter((p) => p.platform === filter);

  return (
    <section id="publications" className="section-pad relative overflow-hidden bg-[var(--bg-primary)]">
      <SectionDecor variant="primary" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Réseaux sociaux"
          title="Mes publications"
          description="Retrouvez mes derniers partages sur les réseaux."
        />

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
      </div>
    </section>
  );
}
