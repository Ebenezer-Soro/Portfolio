import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { etatStockage } from "@/lib/stockage";
import type { Media } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function MediasPage() {
  let media: Media[] = [];
  try {
    media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    media = [];
  }

  // Sans jeton Vercel Blob, les envois échouaient sans explication : on dit
  // ici clairement où vont les fichiers et quoi faire.
  const stockage = etatStockage();

  return (
    <>
      <PageHeader title="Médiathèque" description="Gérez vos fichiers téléversés (images, PDF)" />
      {stockage === "absent" && (
        <p role="alert" className="mb-6 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-[var(--text-primary)]">
          <strong>Les envois d&apos;images échoueront :</strong> aucun stockage n&apos;est configuré.
          Dans Vercel, onglet <em>Storage</em>, crée un stockage <em>Blob</em> et connecte-le à ce
          projet — la connexion fournit <code>BLOB_STORE_ID</code> — ou définis
          <code>BLOB_READ_WRITE_TOKEN</code>, puis redéploie.
        </p>
      )}
      {stockage === "local" && (
        <p className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)]">
          Mode local : sans stockage Blob configuré, les fichiers sont enregistrés dans{" "}
          <code>public/uploads</code>. Ils ne sont ni versionnés ni déployés ; en ligne, il faut un
          stockage Vercel Blob.
        </p>
      )}
      <MediaLibrary initialMedia={media} />
    </>
  );
}
