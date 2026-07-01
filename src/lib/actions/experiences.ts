"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { experienceSchema, type ExperienceFormData } from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/experiences");
}

function toData(parsed: ExperienceFormData) {
  return {
    type: parsed.type,
    title: parsed.title,
    organization: parsed.organization,
    location: parsed.location ?? null,
    startDate: new Date(parsed.startDate),
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
    current: parsed.current,
    description: parsed.description ?? null,
    order: parsed.order,
  };
}

export async function createExperience(data: ExperienceFormData) {
  await assertAdmin();
  const res = await prisma.experience.create({ data: toData(experienceSchema.parse(data)) });
  revalidate();
  return res;
}

export async function updateExperience(id: string, data: ExperienceFormData) {
  await assertAdmin();
  const res = await prisma.experience.update({
    where: { id },
    data: toData(experienceSchema.parse(data)),
  });
  revalidate();
  return res;
}

export async function deleteExperience(id: string) {
  await assertAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidate();
}
