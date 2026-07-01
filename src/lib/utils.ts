import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/** Fusionne des classes Tailwind sans conflits. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Transforme un titre en slug URL-friendly. */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Formate une date en français lisible. */
export function formatDate(date: Date | string, pattern = "d MMMM yyyy"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return format(d, pattern, { locale: fr });
}

/** Distance relative ("il y a 3 jours"). */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

/** Formate une taille de fichier en octets vers Ko/Mo. */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes) return "0 o";
  const k = 1024;
  const sizes = ["o", "Ko", "Mo", "Go", "To"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Estime le temps de lecture (mots / 200 wpm). */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Tronque un texte. */
export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/** Extrait le texte brut d'un document Tiptap JSON. */
export function tiptapToText(json: string | null | undefined): string {
  if (!json) return "";
  try {
    const doc = JSON.parse(json);
    const parts: string[] = [];
    const walk = (node: { text?: string; content?: unknown[] }) => {
      if (node.text) parts.push(node.text);
      if (Array.isArray(node.content))
        node.content.forEach((c) => walk(c as { text?: string; content?: unknown[] }));
    };
    walk(doc);
    return parts.join(" ");
  } catch {
    return json;
  }
}

/** Couleur de badge associée à une plateforme sociale. */
export function platformColor(platform: string): string {
  const map: Record<string, string> = {
    linkedin: "#0077B5",
    github: "#24292e",
    twitter: "#000000",
    x: "#000000",
    instagram: "#E1306C",
    youtube: "#FF0000",
    facebook: "#1877F2",
    dribbble: "#EA4C89",
  };
  return map[platform.toLowerCase()] ?? "#0ea5e9";
}
