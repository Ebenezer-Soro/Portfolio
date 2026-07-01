import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/managers/SettingsForm";
import type { SiteSetting } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  let rows: SiteSetting[] = [];
  try {
    rows = await prisma.siteSetting.findMany();
  } catch {
    rows = [];
  }

  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;

  return (
    <>
      <PageHeader title="Paramètres" description="Configurez les informations générales du site" />
      <SettingsForm settings={settings} />
    </>
  );
}
