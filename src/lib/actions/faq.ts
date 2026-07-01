"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { faqSchema, type FaqFormData } from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function createFaq(data: FaqFormData) {
  await assertAdmin();
  const res = await prisma.fAQ.create({ data: faqSchema.parse(data) });
  revalidate();
  return res;
}

export async function updateFaq(id: string, data: FaqFormData) {
  await assertAdmin();
  const res = await prisma.fAQ.update({ where: { id }, data: faqSchema.parse(data) });
  revalidate();
  return res;
}

export async function deleteFaq(id: string) {
  await assertAdmin();
  await prisma.fAQ.delete({ where: { id } });
  revalidate();
}

export async function toggleFaqActive(id: string) {
  await assertAdmin();
  const f = await prisma.fAQ.findUnique({ where: { id } });
  if (!f) throw new Error("FAQ introuvable");
  const res = await prisma.fAQ.update({ where: { id }, data: { active: !f.active } });
  revalidate();
  return res;
}
