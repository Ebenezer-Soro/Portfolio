import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { Reveal, SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Button } from "@/components/ui/Button";
import type { Post } from "@prisma/client";

export function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <SectionShell id="blog" className="bg-[var(--bg-secondary)]">
        <SectionHeading
          eyebrow="Blog"
          title="Derniers articles"
          description="Mes réflexions et tutoriels sur le développement et la tech."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Tous les articles <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
  );
}
