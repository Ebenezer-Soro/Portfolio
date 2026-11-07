import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPublishedProjects, getPublishedPosts, getProfile, getSocialPosts } from "@/lib/queries";

// Sitemap dynamique : pages statiques + projets & articles publiés.
// L'admin et l'API n'y figurent JAMAIS (aucun accès privé exposé).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, profile, publications] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
    getProfile(),
    getSocialPosts(),
  ]);

  /*
   * `lastModified` sur les pages fixes aussi.
   *
   * Sans date, un robot n'a aucun moyen de savoir qu'une page de liste a
   * changé : il la recharge à son propre rythme, souvent bien après la
   * publication. La date retenue est celle du contenu le plus récent que
   * la page affiche — c'est exactement ce que `lastModified` désigne.
   */
  const plusRecent = (dates: Date[]): Date | undefined =>
    dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;

  const majProjets = plusRecent(projects.map((p) => p.updatedAt));
  const majArticles = plusRecent(posts.map((p) => p.updatedAt));
  // `SocialPost` n'a pas de date de modification : la date de
  // publication est la seule disponible, et c'est celle qui change
  // l'affichage de la page.
  const majPublications = plusRecent(publications.map((p) => p.publishedAt));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: plusRecent(
        [profile.updatedAt, majProjets, majArticles].filter((d): d is Date => !!d),
      ),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projets`,
      lastModified: majProjets,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: majArticles,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/publications`,
      lastModified: majPublications,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: profile.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projets/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
