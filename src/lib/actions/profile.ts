"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { profileSchema, type ProfileFormData } from "@/lib/validations";

export async function updateProfile(data: ProfileFormData) {
  await assertAdmin();
  const parsed = profileSchema.parse(data);

  const existing = await prisma.profile.findFirst();
  const result = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data: parsed })
    : await prisma.profile.create({ data: { id: "singleton", ...parsed } });

  revalidatePath("/");
  revalidatePath("/admin/profil");
  return result;
}
