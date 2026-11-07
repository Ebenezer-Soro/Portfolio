import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/queries";
import { ProjectsListing } from "@/components/public/ProjectsListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projets",
  description: "Découvrez l'ensemble de mes projets et réalisations.",
  alternates: { canonical: "/projets" },
};

export default async function ProjetsPage() {
  const projects = await getPublishedProjects();

  // Même raison que pour le blog : la liste est décrite dans l'ordre
  // affiché, et le fil d'Ariane situe la page dans le site.
  const listeLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projets",
    url: `${SITE_URL}/projets`,
    inLanguage: "fr-FR",
    ...(projects.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((project, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/projets/${project.slug}`,
              name: project.title,
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
      { "@type": "ListItem", position: 2, name: "Projets", item: `${SITE_URL}/projets` },
    ],
  };

  return (
    <div className="container-page pt-32 pb-20">
      <JsonLd data={listeLd} />
      <JsonLd data={filLd} />
      <header className="mb-12 text-center">
        <p className="section-sub-text">Portfolio</p>
        <h1 className="section-head-text mt-2 text-[var(--text-primary)]">
          Tous mes projets
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
          Une vue d’ensemble de mes réalisations, du web à l’IA en passant par la sécurité.
        </p>
      </header>

      <ProjectsListing projects={projects} />
    </div>
  );
}
