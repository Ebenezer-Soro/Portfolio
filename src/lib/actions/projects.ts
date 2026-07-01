"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "./_helpers";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/projets");
  revalidatePath("/admin/projets");
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "projet";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${i++}`;
  }
}

export async function createProject(data: ProjectFormData) {
  await assertAdmin();
  const parsed = projectSchema.parse(data);
  const slug = await uniqueSlug(parsed.slug || parsed.title);
  const project = await prisma.project.create({
    data: {
      title: parsed.title,
      slug,
      description: parsed.description,
      content: parsed.content ?? null,
      coverUrl: parsed.coverUrl ?? null,
      images: parsed.images,
      tags: parsed.tags,
      techStack: parsed.techStack,
      demoUrl: parsed.demoUrl ?? null,
      repoUrl: parsed.repoUrl ?? null,
      featured: parsed.featured,
      published: parsed.published,
      order: parsed.order,
    },
  });
  revalidate();
  return project;
}

export async function updateProject(id: string, data: ProjectFormData) {
  await assertAdmin();
  const parsed = projectSchema.parse(data);
  const slug = await uniqueSlug(parsed.slug || parsed.title, id);
  const project = await prisma.project.update({
    where: { id },
    data: {
      title: parsed.title,
      slug,
      description: parsed.description,
      content: parsed.content ?? null,
      coverUrl: parsed.coverUrl ?? null,
      images: parsed.images,
      tags: parsed.tags,
      techStack: parsed.techStack,
      demoUrl: parsed.demoUrl ?? null,
      repoUrl: parsed.repoUrl ?? null,
      featured: parsed.featured,
      published: parsed.published,
      order: parsed.order,
    },
  });
  revalidate();
  return project;
}

export async function deleteProject(id: string) {
  await assertAdmin();
  await prisma.project.delete({ where: { id } });
  revalidate();
}

export async function toggleProjectPublished(id: string) {
  await assertAdmin();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error("Projet introuvable");
  const updated = await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });
  revalidate();
  return updated;
}
