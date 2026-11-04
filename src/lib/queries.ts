import { prisma } from "./prisma";
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Service,
  Testimonial,
  SocialLink,
  SocialPost,
  Post,
  FAQ,
} from "@prisma/client";

/**
 * Wrapper sûr : si la base est indisponible (build sans DB, etc.),
 * on retourne le fallback au lieu de planter le rendu.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[queries] base de données indisponible:", (e as Error).message);
    }
    return fallback;
  }
}

const DEFAULT_PROFILE: Profile = {
  id: "singleton",
  name: "Soro Z. Ebenezer",
  title: "Développeur Full Stack & Ingénieur Informatique",
  bio: "Passionné par le développement web, la cybersécurité et l'intelligence artificielle.",
  photoUrl: null,
  aboutPhotoUrl: null,
  logoUrl: null,
  email: "contact@soroebenezer.dev",
  phone: null,
  location: "Abidjan, Côte d'Ivoire",
  cvUrl: null,
  isAvailable: true,
  updatedAt: new Date(0),
};

export async function getProfile(): Promise<Profile> {
  return safe(
    async () => (await prisma.profile.findFirst()) ?? DEFAULT_PROFILE,
    DEFAULT_PROFILE,
  );
}

export async function getSettings(): Promise<Record<string, string>> {
  return safe(async () => {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }, {});
}

export async function getPublishedProjects(): Promise<Project[]> {
  return safe(
    () =>
      prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      }),
    [],
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return safe(() => prisma.project.findUnique({ where: { slug } }), null);
}

export async function getSkills(): Promise<Skill[]> {
  return safe(
    () => prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    [],
  );
}

export async function getExperiences(): Promise<Experience[]> {
  return safe(
    () => prisma.experience.findMany({ orderBy: [{ startDate: "desc" }, { order: "asc" }] }),
    [],
  );
}

export async function getServices(): Promise<Service[]> {
  return safe(
    () => prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    [],
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return safe(
    () =>
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return safe(
    () => prisma.socialLink.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    [],
  );
}

export async function getSocialPosts(featuredOnly = false): Promise<SocialPost[]> {
  return safe(
    () =>
      prisma.socialPost.findMany({
        where: { active: true, ...(featuredOnly ? { featured: true } : {}) },
        orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      }),
    [],
  );
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  return safe(
    () =>
      prisma.post.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return safe(() => prisma.post.findUnique({ where: { slug } }), null);
}

export async function getFaqs(): Promise<FAQ[]> {
  return safe(
    () => prisma.fAQ.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    [],
  );
}
