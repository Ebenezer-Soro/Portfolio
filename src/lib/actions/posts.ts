"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { postSchema, type PostFormData } from "@/lib/validations";
import { slugify, tiptapToText, readingTime } from "@/lib/utils";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "article";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${i++}`;
  }
}

function toData(parsed: PostFormData, slug: string) {
  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt ?? null,
    content: parsed.content,
    coverUrl: parsed.coverUrl ?? null,
    tags: parsed.tags,
    published: parsed.published,
    featured: parsed.featured,
    readingTime: parsed.readingTime ?? readingTime(tiptapToText(parsed.content)),
  };
}

export async function createPost(data: PostFormData) {
  await assertAdmin();
  const parsed = postSchema.parse(data);
  const slug = await uniqueSlug(parsed.slug || parsed.title);
  const res = await prisma.post.create({ data: toData(parsed, slug) });
  revalidate();
  return res;
}

export async function updatePost(id: string, data: PostFormData) {
  await assertAdmin();
  const parsed = postSchema.parse(data);
  const slug = await uniqueSlug(parsed.slug || parsed.title, id);
  const res = await prisma.post.update({ where: { id }, data: toData(parsed, slug) });
  revalidate();
  return res;
}

export async function deletePost(id: string) {
  await assertAdmin();
  await prisma.post.delete({ where: { id } });
  revalidate();
}

export async function togglePostPublished(id: string) {
  await assertAdmin();
  const p = await prisma.post.findUnique({ where: { id } });
  if (!p) throw new Error("Article introuvable");
  const res = await prisma.post.update({
    where: { id },
    data: { published: !p.published },
  });
  revalidate();
  return res;
}
