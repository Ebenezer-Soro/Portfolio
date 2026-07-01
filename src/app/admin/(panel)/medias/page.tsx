import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import type { Media } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function MediasPage() {
  let media: Media[] = [];
  try {
    media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    media = [];
  }

  return (
    <>
      <PageHeader title="Médiathèque" description="Gérez vos fichiers téléversés (images, PDF)" />
      <MediaLibrary initialMedia={media} />
    </>
  );
}
