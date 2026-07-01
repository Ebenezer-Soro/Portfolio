# King Portfolio — Soro Z. Ebenezer

Portfolio professionnel full‑stack avec **CMS interne intégré**, espace admin sécurisé et rendu visuel premium. Le site public présente profil, compétences, expériences, projets, services, témoignages, blog et FAQ ; l'espace admin permet de tout gérer (CRUD complet, médiathèque, analytics, paramètres).

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

## Structure

```
prisma/                  Schéma, migrations et seed de la base
public/                  Assets statiques (dont public/uploads pour les médias)
src/
├─ app/
│  ├─ (public)/          Site public (accueil, projets, blog, publications, contact)
│  ├─ admin/             Espace d'administration (login + panel)
│  └─ api/               Routes API (auth, contact, upload, tracking, admin/*)
├─ components/
│  ├─ public/            Sections et UI du site public
│  ├─ admin/             UI de l'espace admin (managers, éditeurs, médiathèque)
│  └─ providers/         Providers (auth, thème, toasts)
├─ lib/
│  ├─ actions/           Server Actions (mutations CMS, protégées par assertAdmin)
│  ├─ auth.ts / auth.config.ts   Configuration NextAuth
│  ├─ prisma.ts          Client Prisma
│  ├─ queries.ts         Lectures publiques (wrapper résilient)
│  ├─ upload.ts          Traitement et sauvegarde des fichiers
│  └─ validations.ts     Schémas Zod
├─ hooks/                Hooks React réutilisables
├─ types/                Types partagés
└─ middleware.ts         Protection des routes /admin
```

## Prérequis

- Node.js 18+ (testé sur Node 24)
- Une base **PostgreSQL** accessible

## Exécution en local

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Configurer l'environnement** — renseigne `.env` :

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/king_portfolio?schema=public"
   NEXTAUTH_SECRET="..."   # openssl rand -base64 32
   AUTH_SECRET="..."        # identique à NEXTAUTH_SECRET
   NEXTAUTH_URL="http://localhost:3000"
   UPLOAD_DIR="./public/uploads"
   ```

   > Astuce base locale rapide : `npx prisma dev` (Postgres jetable) ou une base Postgres cloud.

3. **Préparer la base de données**

   ```bash
   npm run db:generate     # génère le client Prisma
   npm run db:migrate      # crée les tables
   npm run db:seed         # données initiales (admin + profil + démo)
   ```

4. **Démarrer le serveur de développement**

   ```bash
   npm run dev             # http://localhost:3000
   ```

   - Site public : `/`
   - Espace admin : `/admin/login`
     - **Email** : `admin@portfolio.com`
     - **Mot de passe** : `admin123` *(à changer — re‑hash bcrypt dans `prisma/seed.ts`)*

## Scripts

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed initial |
| `npm run db:studio` | Prisma Studio |
| `npm run format` | Prettier |
