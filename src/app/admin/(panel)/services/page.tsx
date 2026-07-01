import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServicesManager } from "@/components/admin/managers/ServicesManager";
import type { Service } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  } catch {
    services = [];
  }

  return (
    <>
      <PageHeader title="Services" description="Gérez les services que vous proposez" />
      <ServicesManager initial={services} />
    </>
  );
}
