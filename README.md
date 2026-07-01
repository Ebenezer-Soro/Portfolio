# King Portfolio — Soro Z. Ebenezer

Portfolio professionnel full‑stack avec **CMS interne intégré**, espace admin sécurisé et rendu visuel premium.
Construit conformément à `PORTFOLIO_SPEC.md`.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript** + **Tailwind CSS v3** (design tokens CSS)
- **Prisma 6** + **PostgreSQL**
- **NextAuth.js v5** (Auth.js) — session JWT admin (8 h)
- **Framer Motion** + **GSAP** — animations
- **Tiptap** — éditeur rich text
- **React Hook Form** + **Zod** — formulaires & validation
- **sharp** — traitement d'images à l'upload
- **react-hot-toast**, **next-themes**, **lucide-react**, **Radix UI**

## Prérequis

- Node.js 18+ (testé sur Node 24)
- Une base **PostgreSQL** accessible

## Installation

```bash
npm install
```

## Configuration

Renseigne `.env` (déjà créé, valeurs à adapter) :

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/king_portfolio?schema=public"
NEXTAUTH_SECRET="..."   # openssl rand -base64 32
AUTH_SECRET="..."        # identique à NEXTAUTH_SECRET
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
```

> Astuce base locale rapide : `npx prisma dev` (Postgres jetable) ou une base Postgres cloud.

## Base de données

```bash
npm run db:generate     # génère le client Prisma
npm run db:migrate      # crée les tables (prisma migrate dev --name init)
npm run db:seed         # données initiales (admin + profil + démo)
```

## Démarrage

```bash
npm run dev             # http://localhost:3000
```

- Site public : `/`
- Espace admin : `/admin/login`
  - **Email** : `admin@portfolio.com`
  - **Mot de passe** : `admin123`
  - ⚠️ Changez ces identifiants en production (re‑hash bcrypt dans `prisma/seed.ts`).

## Build de production

```bash
npm run build && npm run start
```

## Déploiement (Vercel + Neon)

### 1. Base de données — Neon
1. Crée un projet sur [neon.tech](https://neon.tech) et récupère la chaîne de connexion **pooled** (`postgresql://…?sslmode=require`).
2. Applique le schéma depuis ta machine (une seule fois) :
   ```bash
   DATABASE_URL="<url-neon>" npm run db:migrate
   DATABASE_URL="<url-neon>" npm run db:seed
   ```

### 2. Application — Vercel
1. Sur [vercel.com](https://vercel.com) → **Add New Project** → importe le dépôt GitHub.
2. Renseigne les variables d'environnement (**Project Settings → Environment Variables**) :

   | Variable | Valeur |
   |----------|--------|
   | `DATABASE_URL` | chaîne Neon (pooled) |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `NEXTAUTH_SECRET` | identique à `AUTH_SECRET` |
   | `NEXTAUTH_URL` | l'URL de production (ex. `https://mon-portfolio.vercel.app`) |

3. Déploie. **L'intégration Git de Vercel redéploie automatiquement à chaque `push` sur `main`** (et crée un *preview* pour chaque pull request) — c'est le volet **CD**.

> ⚠️ **Uploads** : le stockage de fichiers actuel écrit sur le disque local, ce qui **ne persiste pas** sur Vercel (système de fichiers éphémère). Pour activer la médiathèque en production, migre `src/lib/upload.ts` vers un stockage externe (Vercel Blob, S3, Cloudinary…).

## CI/CD

- **CI** : le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) exécute **lint + typecheck + build** à chaque `push` et pull request sur `main`.
- **CD** : assurée par l'intégration Git native de Vercel (redéploiement automatique sur `push`). Aucun secret à stocker dans GitHub.

## Sécurité — à faire avant la mise en ligne

- [ ] Générer de vrais secrets `AUTH_SECRET` / `NEXTAUTH_SECRET` (ne jamais réutiliser les valeurs `change-me…`).
- [ ] Changer le mot de passe admin par défaut (`admin123`) et l'email de seed.
- [ ] Ne pas committer `.env` / `.env.local` (déjà couverts par `.gitignore`).
- [ ] Migrer les uploads vers un stockage persistant (voir ci-dessus).

## Scripts

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed initial |
| `npm run db:studio` | Prisma Studio |
| `npm run format` | Prettier |

## Structure

Voir `PORTFOLIO_SPEC.md` (section 6). Toutes les sections publiques (Hero, About, Skills,
Experience, Projects, Services, Testimonials, Social Posts, Blog, FAQ, Contact) et tout
l'espace admin (dashboard analytics, CRUD complet, médiathèque, paramètres) sont implémentés.

## Notes d'implémentation

- Le projet a été généré avec les dernières versions (Next 16 / React 19). Tailwind a été
  aligné en **v3** et Prisma en **v6** pour respecter la spec (`tailwind.config.ts`,
  `url = env("DATABASE_URL")`).
- `lucide-react` est épinglé en `0.454.0` (les versions 1.x ont retiré les icônes de marque
  GitHub/LinkedIn/Twitter utilisées par les réseaux sociaux).
- Les lectures publiques sont enveloppées dans un wrapper résilient (`src/lib/queries.ts`) :
  le rendu ne casse pas si la base est momentanément indisponible.
