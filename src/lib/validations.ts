import { z } from "zod";

// ── Contact (public) ──────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères."),
  email: z.string().email("Email invalide."),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères."),
});
export type ContactFormData = z.infer<typeof contactSchema>;

// ── Login admin ───────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Email invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ── Profil ────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  photoUrl: z.string().optional().nullable(),
  aboutPhotoUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  cvUrl: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

// ── Projet ────────────────────────────────────────────────
export const projectSchema = z.object({
  title: z.string().min(1, "Titre requis."),
  slug: z.string().optional(),
  description: z.string().min(1, "Description requise."),
  content: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  demoUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
});
export type ProjectFormData = z.infer<typeof projectSchema>;

// ── Compétence ────────────────────────────────────────────
export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(0).max(100).default(80),
  category: z.string().min(1),
  iconUrl: z.string().optional().nullable(),
  order: z.number().int().default(0),
});
export type SkillFormData = z.infer<typeof skillSchema>;

// ── Expérience ────────────────────────────────────────────
export const experienceSchema = z.object({
  type: z.enum(["work", "education"]),
  title: z.string().min(1),
  organization: z.string().min(1),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});
export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ── Service ───────────────────────────────────────────────
export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1).default("Sparkles"),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type ServiceFormData = z.infer<typeof serviceSchema>;

// ── Témoignage ────────────────────────────────────────────
export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().optional().nullable(),
  content: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(false),
});
export type TestimonialFormData = z.infer<typeof testimonialSchema>;

// ── Lien social ───────────────────────────────────────────
export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("URL invalide."),
  iconName: z.string().min(1),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

// ── Publication sociale ───────────────────────────────────
export const socialPostSchema = z.object({
  platform: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  url: z.string().url("URL invalide."),
  thumbnailUrl: z.string().optional().nullable(),
  publishedAt: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});
export type SocialPostFormData = z.infer<typeof socialPostSchema>;

// ── Article de blog ───────────────────────────────────────
export const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readingTime: z.number().int().optional().nullable(),
});
export type PostFormData = z.infer<typeof postSchema>;

// ── FAQ ───────────────────────────────────────────────────
export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type FaqFormData = z.infer<typeof faqSchema>;

// ── Paramètre du site ─────────────────────────────────────
export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});
export type SettingFormData = z.infer<typeof settingSchema>;
