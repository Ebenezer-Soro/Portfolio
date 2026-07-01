"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { serviceSchema, type ServiceFormData } from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function createService(data: ServiceFormData) {
  await assertAdmin();
  const res = await prisma.service.create({ data: serviceSchema.parse(data) });
  revalidate();
  return res;
}

export async function updateService(id: string, data: ServiceFormData) {
  await assertAdmin();
  const res = await prisma.service.update({ where: { id }, data: serviceSchema.parse(data) });
  revalidate();
  return res;
}

export async function deleteService(id: string) {
  await assertAdmin();
  await prisma.service.delete({ where: { id } });
  revalidate();
}

export async function toggleServicePublished(id: string) {
  await assertAdmin();
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) throw new Error("Service introuvable");
  const res = await prisma.service.update({
    where: { id },
    data: { published: !s.published },
  });
  revalidate();
  return res;
}
