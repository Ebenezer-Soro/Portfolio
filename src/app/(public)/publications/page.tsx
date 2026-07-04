import type { Metadata } from "next";
import { getSocialPosts } from "@/lib/queries";
import { PublicationsListing } from "@/components/public/PublicationsListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Publications",
  description: "Toutes mes publications sur les réseaux sociaux.",
  alternates: { canonical: "/publications" },
};

export default async function PublicationsPage() {
  const posts = await getSocialPosts(false);

  return (
    <div className="container-page pt-32 pb-20">
      <header className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Réseaux sociaux
        </span>
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
          Toutes mes publications
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
          Mes partages, articles et annonces sur LinkedIn, GitHub, Twitter et plus encore.
        </p>
      </header>

      <PublicationsListing posts={posts} />
    </div>
  );
}
