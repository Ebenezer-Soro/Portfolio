"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { skillSchema, type SkillFormData } from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/competences");
}

export async function createSkill(data: SkillFormData) {
  await assertAdmin();
  const parsed = skillSchema.parse(data);
  const res = await prisma.skill.create({ data: parsed });
  revalidate();
  return res;
}

export async function updateSkill(id: string, data: SkillFormData) {
  await assertAdmin();
  const parsed = skillSchema.parse(data);
  const res = await prisma.skill.update({ where: { id }, data: parsed });
  revalidate();
  return res;
}

export async function deleteSkill(id: string) {
  await assertAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidate();
}

export async function reorderSkills(ids: string[]) {
  await assertAdmin();
  await prisma.$transaction(
    ids.map((id, index) => prisma.skill.update({ where: { id }, data: { order: index } })),
  );
  revalidate();
}
