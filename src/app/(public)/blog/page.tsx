import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { BlogCard } from "@/components/public/BlogCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, tutoriels et réflexions sur le développement et la tech.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container-page pt-32 pb-20">
      <header className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Blog
        </span>
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
          Articles & Tutoriels
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
          Mes réflexions sur le développement web, la sécurité et l’intelligence artificielle.
        </p>
      </header>

      {posts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-[var(--text-muted)]">
          Aucun article publié pour le moment.
        </p>
      )}
    </div>
  );
}
