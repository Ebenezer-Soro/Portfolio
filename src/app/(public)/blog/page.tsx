import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { BlogCard } from "@/components/public/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, tutoriels et réflexions sur le développement et la tech.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  /*
   * La liste annoncée aux moteurs dans l'ordre affiché : c'est ce qui
   * permet à Google de présenter les articles en groupe sous le site,
   * plutôt qu'une page de liste anonyme. Le fil d'Ariane remplace l'URL
   * brute par « Accueil › Blog » dans le résultat.
   */
  const listeLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    url: `${SITE_URL}/blog`,
    inLanguage: "fr-FR",
    ...(posts.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/blog/${post.slug}`,
              name: post.title,
            })),
          },
        }
      : {}),
  };

  const filLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <div className="container-page pt-32 pb-20">
      <JsonLd data={listeLd} />
      <JsonLd data={filLd} />
      <header className="mb-12 text-center">
        <p className="section-sub-text">Blog</p>
        <h1 className="section-head-text mt-2 text-[var(--text-primary)]">
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
