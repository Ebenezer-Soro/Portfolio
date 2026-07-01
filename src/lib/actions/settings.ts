"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";

export async function updateSetting(key: string, value: string) {
  await assertAdmin();
  const res = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/");
  revalidatePath("/admin/parametres");
  return res;
}

export async function updateSettings(entries: Record<string, string>) {
  await assertAdmin();
  await prisma.$transaction(
    Object.entries(entries).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
  revalidatePath("/");
  revalidatePath("/admin/parametres");
}
