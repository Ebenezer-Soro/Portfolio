"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
}

export async function createTestimonial(data: TestimonialFormData) {
  await assertAdmin();
  const res = await prisma.testimonial.create({ data: testimonialSchema.parse(data) });
  revalidate();
  return res;
}

export async function updateTestimonial(id: string, data: TestimonialFormData) {
  await assertAdmin();
  const res = await prisma.testimonial.update({
    where: { id },
    data: testimonialSchema.parse(data),
  });
  revalidate();
  return res;
}

export async function deleteTestimonial(id: string) {
  await assertAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidate();
}

export async function toggleTestimonialPublished(id: string) {
  await assertAdmin();
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) throw new Error("Témoignage introuvable");
  const res = await prisma.testimonial.update({
    where: { id },
    data: { published: !t.published },
  });
  revalidate();
  return res;
}
