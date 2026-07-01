"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import {
  socialLinkSchema,
  type SocialLinkFormData,
  socialPostSchema,
  type SocialPostFormData,
} from "@/lib/validations";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/publications");
  revalidatePath("/admin/reseaux");
}

// ── Liens sociaux ─────────────────────────────────────────
export async function createSocialLink(data: SocialLinkFormData) {
  await assertAdmin();
  const res = await prisma.socialLink.create({ data: socialLinkSchema.parse(data) });
  revalidate();
  return res;
}

export async function updateSocialLink(id: string, data: SocialLinkFormData) {
  await assertAdmin();
  const res = await prisma.socialLink.update({
    where: { id },
    data: socialLinkSchema.parse(data),
  });
  revalidate();
  return res;
}

export async function deleteSocialLink(id: string) {
  await assertAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidate();
}

export async function reorderSocialLinks(ids: string[]) {
  await assertAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.socialLink.update({ where: { id }, data: { order: index } }),
    ),
  );
  revalidate();
}

// ── Publications sociales ─────────────────────────────────
function postToData(parsed: SocialPostFormData) {
  return {
    platform: parsed.platform,
    title: parsed.title,
    description: parsed.description ?? null,
    url: parsed.url,
    thumbnailUrl: parsed.thumbnailUrl ?? null,
    publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : new Date(),
    featured: parsed.featured,
    active: parsed.active,
    order: parsed.order,
  };
}

export async function createSocialPost(data: SocialPostFormData) {
  await assertAdmin();
  const res = await prisma.socialPost.create({ data: postToData(socialPostSchema.parse(data)) });
  revalidate();
  return res;
}

export async function updateSocialPost(id: string, data: SocialPostFormData) {
  await assertAdmin();
  const res = await prisma.socialPost.update({
    where: { id },
    data: postToData(socialPostSchema.parse(data)),
  });
  revalidate();
  return res;
}

export async function deleteSocialPost(id: string) {
  await assertAdmin();
  await prisma.socialPost.delete({ where: { id } });
  revalidate();
}

export async function toggleSocialPostFeatured(id: string) {
  await assertAdmin();
  const p = await prisma.socialPost.findUnique({ where: { id } });
  if (!p) throw new Error("Publication introuvable");
  const res = await prisma.socialPost.update({
    where: { id },
    data: { featured: !p.featured },
  });
  revalidate();
  return res;
}

export async function toggleSocialPostActive(id: string) {
  await assertAdmin();
  const p = await prisma.socialPost.findUnique({ where: { id } });
  if (!p) throw new Error("Publication introuvable");
  const res = await prisma.socialPost.update({
    where: { id },
    data: { active: !p.active },
  });
  revalidate();
  return res;
}
