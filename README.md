# Portfolio — Soro Z. Ebenezer

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
   ADMIN_EMAIL="..."        # compte administrateur créé par le seed
   ADMIN_PASSWORD="..."     # mot de passe long et unique
   BLOB_READ_WRITE_TOKEN="" # facultatif en local : sans lui, les images vont dans public/uploads
   ```

   > Astuce base locale rapide : `npx prisma dev` (Postgres jetable) ou une base Postgres cloud.

3. **Préparer la base de données**

   ```bash
   npm run db:generate     # génère le client Prisma
   npm run db:migrate      # crée les tables
   npm run db:seed         # compte admin + tes informations (voir ci-dessous)
   ```

4. **Démarrer le serveur de développement**

   ```bash
   npm run dev             # http://localhost:3000
   ```

   - Site public : `/`
   - Espace admin : raccourci **Ctrl + Alt + E** depuis n'importe quelle page
     (inactif dans un champ de saisie), ou l'adresse `/admin/login`. Aucun
     lien ne mène à l'admin depuis le site.
     - Identifiants : ceux de `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Le seed ne
       réinitialise jamais un mot de passe changé depuis l'admin.
     - 5 tentatives de connexion par quart d'heure et par adresse IP.

## Remplir le site avec tes informations

Ouvre `prisma/donnees/formulaire.html` (double-clic) : un questionnaire pose
une question à la fois et produit `mes-infos.json`. Place ce fichier dans
`prisma/donnees/`, puis :

```bash
npm run db:injecter:simulation   # essai à blanc : tout est écrit puis annulé
npm run db:injecter              # injection réelle, en une seule transaction
```

Détails et garanties : [`prisma/donnees/LISEZ-MOI.md`](prisma/donnees/LISEZ-MOI.md).
Tout reste ensuite modifiable depuis l'admin, section par section, et chaque
section de la page d'accueil peut y être masquée (Paramètres).

## Déploiement (Vercel)

Le déploiement suit l'intégration Git de Vercel : chaque push sur `main` est
déployé ; la CI GitHub (`.github/workflows/ci.yml`) vérifie lint, types et
build.

Variables à définir dans **Vercel › Settings › Environment Variables** :

| Variable | Rôle |
|----------|------|
| `DATABASE_URL` | Base PostgreSQL de production |
| `AUTH_SECRET`, `NEXTAUTH_SECRET` | Signature des sessions (`openssl rand -base64 32`) — **valeurs neuves**, jamais celles d'un ancien `.env` |
| `NEXTAUTH_URL` | Adresse publique du site, par exemple `https://ton-domaine.com` |
| `BLOB_READ_WRITE_TOKEN` | **Indispensable aux images.** Créé automatiquement en connectant un stockage : onglet **Storage › Create › Blob**, puis *Connect to project*. Sans lui, tout envoi d'image échoue en ligne (l'admin l'indique dans la Médiathèque). |
| `NEXT_PUBLIC_SITE_URL` | Facultatif : domaine personnalisé pour les URL canoniques, le sitemap et les aperçus de partage. À défaut, le domaine de production Vercel est utilisé. |

Après tout changement de variable : **Redeploy**.

Les images envoyées depuis l'admin sont réduites dans le navigateur avant
l'envoi (Vercel refuse les requêtes de plus de 4,5 Mo), converties en WebP par
le serveur, puis stockées sur Vercel Blob.

## Scripts

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed : compte admin + `mes-infos.json` (ou l'exemple) |
| `npm run db:injecter` | Injection de `mes-infos.json` (accepte `-- --fichier <chemin>`) |
| `npm run db:injecter:simulation` | Essai à blanc de l'injection, rien n'est écrit |
| `npm run db:studio` | Prisma Studio |
| `npm run format` | Prettier |
