"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";

function revalidate() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

export async function markMessageRead(id: string, read = true) {
  await assertAdmin();
  const res = await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidate();
  return res;
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidate();
}

export async function markAllMessagesRead() {
  await assertAdmin();
  await prisma.contactMessage.updateMany({ where: { read: false }, data: { read: true } });
  revalidate();
}
