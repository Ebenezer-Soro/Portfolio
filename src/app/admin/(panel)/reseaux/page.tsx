import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ReseauxManager } from "@/components/admin/managers/ReseauxManager";
import type { SocialLink, SocialPost } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ReseauxPage() {
  let links: SocialLink[] = [];
  let posts: SocialPost[] = [];

  try {
    links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch {
    links = [];
  }

  try {
    posts = await prisma.socialPost.findMany({
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    });
  } catch {
    posts = [];
  }

  return (
    <>
      <PageHeader
        title="Réseaux & Publications"
        description="Gérez vos liens réseaux sociaux et vos publications partagées"
      />
      <ReseauxManager links={links} posts={posts} />
    </>
  );
}
