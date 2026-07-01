"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { deleteUpload } from "@/lib/upload";

export async function deleteMedia(id: string) {
  await assertAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    await deleteUpload(media.url);
    await prisma.media.delete({ where: { id } });
  }
  revalidatePath("/admin/medias");
}
