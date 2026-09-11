/**
 * Format du fichier d'informations lu par le seed.
 *
 * Chaque entrée est validée par le MÊME schéma que le back-office
 * (`src/lib/validations.ts`) : le seed refuse exactement ce que le CMS
 * refuserait, et une évolution du CMS se répercute ici sans double saisie.
 *
 * Trois ajustements seulement par rapport au CMS :
 *  - `order` disparaît : l'ordre est celui des listes dans le fichier ;
 *  - les liens sont restreints à `https:`, `http:` ou un chemin local — le
 *    CMS accepte toute URL syntaxiquement valide, `javascript:` compris ;
 *  - les dates du parcours sont au format `AAAA-MM` (champ « mois » du
 *    formulaire).
 */
import { z } from "zod";
import {
  profileSchema,
  projectSchema,
  skillSchema,
  experienceSchema,
  serviceSchema,
  testimonialSchema,
  socialLinkSchema,
  socialPostSchema,
  postSchema,
  faqSchema,
} from "../../src/lib/validations";
import { SECTIONS_MASQUABLES } from "../../src/lib/sections";

/** Chemin servi depuis `public/` (« /images/moi.png ») ou URL web. */
const lienSur = z
  .string()
  .trim()
  .refine(
    (v) => {
      // `//hote/...` est une URL externe déguisée en chemin : refusée.
      if (v.startsWith("/")) return !v.startsWith("//");
      try {
        return ["https:", "http:"].includes(new URL(v).protocol);
      } catch {
        return false;
      }
    },
    { message: "doit être une URL https:// ou un chemin commençant par /" },
  );

const lienFacultatif = lienSur.nullable().optional();

/** Les réseaux admettent aussi `mailto:` (bouton « m'écrire »). */
const lienReseau = z
  .string()
  .trim()
  .refine(
    (v) => {
      try {
        return ["https:", "http:", "mailto:"].includes(new URL(v).protocol);
      } catch {
        return false;
      }
    },
    { message: "doit être une URL https:// ou mailto:" },
  );

const mois = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])(-\d{2})?$/, "format attendu : AAAA-MM");

export const fichierSchema = z.object({
  version: z.literal(1),

  profil: profileSchema.extend({
    photoUrl: lienFacultatif,
    aboutPhotoUrl: lienFacultatif,
    logoUrl: lienFacultatif,
    cvUrl: lienFacultatif,
  }),

  parametres: z
    .object({
      site_name: z.string().trim().min(1).optional(),
      stats_projects: z.coerce.number().int().min(0).optional(),
      stats_years: z.coerce.number().int().min(0).optional(),
      stats_techs: z.coerce.number().int().min(0).optional(),
      // `partialRecord` et non `record` : depuis Zod 4, un `record` à clés
      // énumérées exige TOUTES les clés.
      sections: z
        .partialRecord(
          z.enum(SECTIONS_MASQUABLES.map((s) => s.id) as [string, ...string[]]),
          z.boolean(),
        )
        .optional(),
    })
    .optional(),

  /*
   * Listes : une section ABSENTE du fichier n'est pas touchée en base ; une
   * section PRÉSENTE la remplace entièrement, y compris par une liste vide.
   */
  reseaux: z
    .array(socialLinkSchema.omit({ order: true }).extend({ url: lienReseau }))
    .optional(),

  services: z.array(serviceSchema.omit({ order: true })).optional(),

  competences: z
    .array(skillSchema.omit({ order: true }).extend({ iconUrl: lienFacultatif }))
    .optional(),

  parcours: z
    .array(
      experienceSchema
        .omit({ order: true })
        .extend({ startDate: mois, endDate: mois.nullable().optional() })
        .refine((e) => e.current || e.endDate, {
          message: "une date de fin est requise si le poste n'est pas en cours",
          path: ["endDate"],
        })
        // Comparaison de chaînes AAAA-MM : l'ordre lexical est l'ordre chronologique.
        .refine((e) => e.current || !e.endDate || e.endDate.slice(0, 7) >= e.startDate.slice(0, 7), {
          message: "la date de fin précède la date de début",
          path: ["endDate"],
        }),
    )
    .optional(),

  projets: z
    .array(
      projectSchema.omit({ order: true }).extend({
        coverUrl: lienFacultatif,
        images: z.array(lienSur).default([]),
        demoUrl: lienFacultatif,
        repoUrl: lienFacultatif,
      }),
    )
    .optional(),

  publications: z
    .array(
      socialPostSchema.omit({ order: true }).extend({
        url: lienSur,
        thumbnailUrl: lienFacultatif,
        publishedAt: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "format attendu : AAAA-MM-JJ")
          .optional(),
      }),
    )
    .optional(),

  // `content` est du texte brut (paragraphes séparés par une ligne vide) ;
  // le seed le convertit en document Tiptap, le format du back-office.
  articles: z.array(postSchema.extend({ coverUrl: lienFacultatif })).optional(),

  faq: z.array(faqSchema.omit({ order: true })).optional(),

  temoignages: z
    .array(testimonialSchema.extend({ avatarUrl: lienFacultatif }))
    .optional(),
});

export type Fichier = z.infer<typeof fichierSchema>;

/** Sections de type liste, dans l'ordre d'injection. */
export const SECTIONS_LISTES = [
  "reseaux",
  "services",
  "competences",
  "parcours",
  "projets",
  "publications",
  "articles",
  "faq",
  "temoignages",
] as const;
