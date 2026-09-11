/**
 * Seed — injection des informations du portfolio.
 *
 * SOURCE DES DONNÉES
 *   1. `--fichier <chemin>` s'il est fourni ;
 *   2. sinon `prisma/donnees/mes-infos.json` (produit par le formulaire
 *      `prisma/donnees/formulaire.html`) ;
 *   3. sinon `prisma/donnees/exemple.json`.
 *
 * DEUX RÉGIMES, SELON LA SOURCE
 *   - Fichier personnel (1 ou 2) : il fait AUTORITÉ. Chaque section présente
 *     remplace la section correspondante en base ; une section absente n'est
 *     pas touchée. Le profil et les paramètres sont écrasés.
 *   - Exemple (3) : on ne remplit que ce qui est VIDE, comme l'ancien seed.
 *     Relancer `prisma migrate` sur une base déjà renseignée ne doit jamais
 *     écraser un contenu saisi dans le back-office par des données factices.
 *
 * SÛRETÉ
 *   Toutes les écritures ont lieu dans une seule transaction : une erreur au
 *   milieu laisse la base intacte. `--simulation` exécute réellement ces
 *   écritures — contraintes et types compris — puis annule la transaction :
 *   c'est un essai à blanc complet, pas une simple relecture du fichier.
 *
 * NE SONT JAMAIS TOUCHÉS : messages de contact, visites, médiathèque.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { fichierSchema, SECTIONS_LISTES, type Fichier } from "./donnees/schema";
import { slugify, readingTime } from "../src/lib/utils";
import { cleVisibilite } from "../src/lib/sections";

// Messages de validation en français. Réglage GLOBAL de Zod : il n'a sa place
// que dans ce processus, jamais dans un module partagé avec l'application.
z.config(z.locales.fr());

const prisma = new PrismaClient();

const DOSSIER = path.join(__dirname, "donnees");
const PERSONNEL = path.join(DOSSIER, "mes-infos.json");
const EXEMPLE = path.join(DOSSIER, "exemple.json");

// ── Arguments ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const simulation = args.includes("--simulation");
const iFichier = args.indexOf("--fichier");
const fichierArgument = iFichier >= 0 ? args[iFichier + 1] : undefined;
if (iFichier >= 0 && !fichierArgument) {
  throw new Error("--fichier attend un chemin : --fichier C:\\chemin\\mes-infos.json");
}

/** Exception interne servant uniquement à annuler la transaction. */
class AnnulationSimulation extends Error {}

type Tx = Prisma.TransactionClient;

// ── Lecture et validation ─────────────────────────────────────────────
function choisirSource(): { chemin: string; autorite: boolean } {
  if (fichierArgument) return { chemin: path.resolve(fichierArgument), autorite: true };
  if (fs.existsSync(PERSONNEL)) return { chemin: PERSONNEL, autorite: true };
  return { chemin: EXEMPLE, autorite: false };
}

export function lire(chemin: string): Fichier {
  if (!fs.existsSync(chemin)) throw new Error(`Fichier introuvable : ${chemin}`);

  let brut: unknown;
  try {
    // Le BOM qu'ajoutent certains éditeurs Windows rendrait le JSON invalide.
    brut = JSON.parse(fs.readFileSync(chemin, "utf8").replace(/^\uFEFF/, ""));
  } catch (e) {
    throw new Error(`JSON invalide dans ${chemin} : ${(e as Error).message}`);
  }

  const res = fichierSchema.safeParse(brut);
  if (!res.success) {
    const lignes = res.error.issues.map((i) => {
      const lieu = i.path
        .map((p, k) => (typeof p === "number" ? `[${p + 1}]` : `${k ? "." : ""}${String(p)}`))
        .join("");
      return `  • ${lieu || "(racine)"} : ${i.message}`;
    });
    throw new Error(
      `Le fichier ne respecte pas le format attendu (${lignes.length} problème(s)) :\n` +
        lignes.join("\n") +
        "\n  (les numéros entre crochets comptent à partir de 1)",
    );
  }
  return res.data;
}

// ── Conversions ───────────────────────────────────────────────────────
/**
 * Le back-office stocke les textes riches au format Tiptap. Le formulaire
 * produit du texte brut : chaque bloc séparé par une ligne vide devient un
 * paragraphe. Un contenu déjà au format Tiptap est conservé tel quel.
 */
function versTiptap(texte: string): string {
  try {
    const doc = JSON.parse(texte);
    if (doc && doc.type === "doc") return texte;
  } catch {
    /* texte brut : conversion ci-dessous */
  }
  const paragraphes = texte
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return JSON.stringify({
    type: "doc",
    content: paragraphes.map((p) => ({
      type: "paragraph",
      content: p.split("\n").flatMap((ligne, i) => [
        ...(i ? [{ type: "hardBreak" }] : []),
        { type: "text", text: ligne },
      ]),
    })),
  });
}

/** « 2023-01 » → 1er janvier 2023 à minuit UTC (pas de décalage de fuseau). */
const date = (v: string) => new Date(`${v.length === 7 ? `${v}-01` : v}T00:00:00.000Z`);

/** Rend les slugs uniques DANS le fichier : « mon-projet », « mon-projet-2 »… */
function slugsUniques<T extends { title: string; slug?: string }>(items: T[]) {
  const vus = new Map<string, number>();
  return items.map((it) => {
    const base = slugify(it.slug?.trim() || it.title) || "sans-titre";
    const n = (vus.get(base) ?? 0) + 1;
    vus.set(base, n);
    return { ...it, slug: n === 1 ? base : `${base}-${n}` };
  });
}

const vide = (v: string | null | undefined) => (v && v.trim() ? v.trim() : null);

// ── Écriture d'une section ────────────────────────────────────────────
type Rapport = { section: string; avant: number; apres: number; note?: string };

/**
 * Remplace (fichier personnel) ou complète si vide (exemple) une table.
 * `compter` / `vider` / `creer` isolent la table concernée.
 */
async function ecrire(
  section: string,
  autorite: boolean,
  compter: () => Promise<number>,
  vider: () => Promise<unknown>,
  creer: () => Promise<unknown>,
  nb: number,
): Promise<Rapport> {
  const avant = await compter();
  if (!autorite && avant > 0) {
    return { section, avant, apres: avant, note: "déjà renseignée — conservée" };
  }
  if (avant > 0) await vider();
  if (nb > 0) await creer();
  return { section, avant, apres: nb };
}

export async function injecter(tx: Tx, d: Fichier, autorite: boolean): Promise<Rapport[]> {
  const rapports: Rapport[] = [];

  // ── Profil (singleton) ──────────────────────────────────────────────
  const p = d.profil;
  const profil = {
    name: p.name.trim(),
    title: p.title.trim(),
    bio: p.bio.trim(),
    photoUrl: vide(p.photoUrl),
    aboutPhotoUrl: vide(p.aboutPhotoUrl),
    logoUrl: vide(p.logoUrl),
    email: vide(p.email),
    phone: vide(p.phone),
    location: vide(p.location),
    cvUrl: vide(p.cvUrl),
    isAvailable: p.isAvailable,
  };
  // Le site lit le PREMIER profil venu : on s'assure qu'il n'en reste qu'un.
  const profilAvant = await tx.profile.count();
  if (autorite) {
    await tx.profile.deleteMany({ where: { id: { not: "singleton" } } });
    await tx.profile.upsert({
      where: { id: "singleton" },
      update: profil,
      create: { id: "singleton", ...profil },
    });
    rapports.push({ section: "profil", avant: profilAvant, apres: 1 });
  } else if (profilAvant === 0) {
    await tx.profile.create({ data: { id: "singleton", ...profil } });
    rapports.push({ section: "profil", avant: 0, apres: 1 });
  } else {
    rapports.push({ section: "profil", avant: profilAvant, apres: profilAvant, note: "déjà renseigné — conservé" });
  }

  // ── Paramètres ──────────────────────────────────────────────────────
  const pa = d.parametres ?? {};
  const reglages: [string, string][] = [];
  if (pa.site_name) reglages.push(["site_name", pa.site_name]);
  for (const k of ["stats_projects", "stats_years", "stats_techs"] as const) {
    if (pa[k] !== undefined) reglages.push([k, String(pa[k])]);
  }
  for (const [id, visible] of Object.entries(pa.sections ?? {})) {
    reglages.push([cleVisibilite(id), String(visible)]);
  }
  let ecrits = 0;
  for (const [key, value] of reglages) {
    await tx.siteSetting.upsert({
      where: { key },
      // Régime exemple : on ne modifie pas un réglage existant.
      update: autorite ? { value } : {},
      create: { key, value },
    });
    ecrits++;
  }
  rapports.push({
    section: "paramètres",
    avant: 0,
    apres: ecrits,
    note: autorite ? "clés mises à jour une à une" : "clés créées si absentes",
  });

  // ── Listes ──────────────────────────────────────────────────────────
  const presente = (s: (typeof SECTIONS_LISTES)[number]) => d[s] !== undefined;

  if (presente("reseaux")) {
    const data = d.reseaux!.map((r, i) => ({ ...r, url: r.url.trim(), order: i + 1 }));
    rapports.push(
      await ecrire("réseaux", autorite, () => tx.socialLink.count(), () => tx.socialLink.deleteMany(),
        () => tx.socialLink.createMany({ data }), data.length),
    );
  }

  if (presente("services")) {
    const data = d.services!.map((s, i) => ({ ...s, order: i + 1 }));
    rapports.push(
      await ecrire("services", autorite, () => tx.service.count(), () => tx.service.deleteMany(),
        () => tx.service.createMany({ data }), data.length),
    );
  }

  if (presente("competences")) {
    // L'ordre d'affichage se lit PAR CATÉGORIE : on numérote dans chacune.
    const rang = new Map<string, number>();
    const data = d.competences!.map((c) => {
      const n = (rang.get(c.category) ?? 0) + 1;
      rang.set(c.category, n);
      return { ...c, category: c.category.trim(), iconUrl: vide(c.iconUrl), order: n };
    });
    rapports.push(
      await ecrire("compétences", autorite, () => tx.skill.count(), () => tx.skill.deleteMany(),
        () => tx.skill.createMany({ data }), data.length),
    );
  }

  if (presente("parcours")) {
    const data = d.parcours!.map((e, i) => ({
      type: e.type,
      title: e.title,
      organization: e.organization,
      location: vide(e.location),
      startDate: date(e.startDate),
      // Un poste en cours n'a pas de date de fin, quoi que dise le fichier.
      endDate: e.current || !e.endDate ? null : date(e.endDate),
      current: e.current,
      description: vide(e.description),
      order: i + 1,
    }));
    rapports.push(
      await ecrire("parcours", autorite, () => tx.experience.count(), () => tx.experience.deleteMany(),
        () => tx.experience.createMany({ data }), data.length),
    );
  }

  if (presente("projets")) {
    const data = slugsUniques(d.projets!).map((pr, i) => ({
      ...pr,
      content: pr.content?.trim() ? versTiptap(pr.content) : null,
      coverUrl: vide(pr.coverUrl),
      demoUrl: vide(pr.demoUrl),
      repoUrl: vide(pr.repoUrl),
      order: i + 1,
    }));
    rapports.push(
      await ecrire("projets", autorite, () => tx.project.count(), () => tx.project.deleteMany(),
        () => tx.project.createMany({ data }), data.length),
    );
  }

  if (presente("publications")) {
    const data = d.publications!.map((po, i) => ({
      ...po,
      description: vide(po.description),
      thumbnailUrl: vide(po.thumbnailUrl),
      publishedAt: po.publishedAt ? date(po.publishedAt) : new Date(),
      order: i + 1,
    }));
    rapports.push(
      await ecrire("publications", autorite, () => tx.socialPost.count(), () => tx.socialPost.deleteMany(),
        () => tx.socialPost.createMany({ data }), data.length),
    );
  }

  if (presente("articles")) {
    const data = slugsUniques(d.articles!).map((a) => ({
      ...a,
      excerpt: vide(a.excerpt),
      content: versTiptap(a.content),
      coverUrl: vide(a.coverUrl),
      readingTime: a.readingTime ?? readingTime(a.content),
    }));
    rapports.push(
      await ecrire("articles", autorite, () => tx.post.count(), () => tx.post.deleteMany(),
        () => tx.post.createMany({ data }), data.length),
    );
  }

  if (presente("faq")) {
    const data = d.faq!.map((f, i) => ({ ...f, order: i + 1 }));
    rapports.push(
      await ecrire("faq", autorite, () => tx.fAQ.count(), () => tx.fAQ.deleteMany(),
        () => tx.fAQ.createMany({ data }), data.length),
    );
  }

  if (presente("temoignages")) {
    const data = d.temoignages!.map((t) => ({
      ...t,
      company: vide(t.company),
      avatarUrl: vide(t.avatarUrl),
    }));
    rapports.push(
      await ecrire("témoignages", autorite, () => tx.testimonial.count(), () => tx.testimonial.deleteMany(),
        () => tx.testimonial.createMany({ data }), data.length),
    );
  }

  return rapports;
}

// ── Compte administrateur ─────────────────────────────────────────────
async function administrateur(nom: string) {
  const email = process.env.ADMIN_EMAIL;
  const motDePasse = process.env.ADMIN_PASSWORD;
  if (!email || !motDePasse) {
    throw new Error(
      "ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis (non vides) dans .env avant de lancer le seed.",
    );
  }
  // `update: {}` : un mot de passe changé depuis le back-office n'est jamais
  // réinitialisé par un nouveau passage du seed.
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: await bcrypt.hash(motDePasse, 12), name: nom },
  });
}

// ── Programme principal ───────────────────────────────────────────────
async function main() {
  const { chemin, autorite } = choisirSource();
  const donnees = lire(chemin);

  console.log(`\nSource : ${path.relative(process.cwd(), chemin) || chemin}`);
  console.log(
    autorite
      ? "Régime : fichier personnel — les sections présentes REMPLACENT celles de la base."
      : "Régime : exemple — seules les sections vides sont remplies.",
  );
  if (simulation) console.log("Mode simulation : les écritures seront annulées.\n");

  let rapports: Rapport[] = [];
  try {
    await prisma.$transaction(
      async (tx) => {
        rapports = await injecter(tx, donnees, autorite);
        if (simulation) throw new AnnulationSimulation();
      },
      // Base distante : la latence réseau multiplie la durée de chaque requête.
      { maxWait: 20_000, timeout: 120_000 },
    );
  } catch (e) {
    if (!(e instanceof AnnulationSimulation)) throw e;
  }

  console.table(
    rapports.map((r) => ({
      section: r.section,
      "avant": r.avant,
      "après": r.apres,
      note: r.note ?? (r.apres === 0 && r.avant > 0 ? "vidée" : ""),
    })),
  );

  if (simulation) {
    console.log("✅ Simulation réussie : le fichier est valide et s'injecte sans erreur. Rien n'a été écrit.");
    return;
  }

  await administrateur(donnees.profil.name);
  console.log("✅ Seed terminé");
}

// Exécuté seulement en lancement direct : importer `injecter` (tests) ne
// déclenche aucune injection.
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(`\n❌ ${e instanceof Error ? e.message : e}`);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
