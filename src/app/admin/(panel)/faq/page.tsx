import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { FaqManager } from "@/components/admin/managers/FaqManager";
import type { FAQ } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  let faqs: FAQ[] = [];
  try {
    faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  } catch {
    faqs = [];
  }

  return (
    <>
      <PageHeader title="FAQ" description="Gérez les questions fréquemment posées" />
      <FaqManager initial={faqs} />
    </>
  );
}
