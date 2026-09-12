# Portfolio — Soro Z. Ebenezer

Portfolio personnel avec **son propre CMS**. Le site public présente le profil,
les services, les compétences, le parcours, les projets, les publications, le
blog, la FAQ, les témoignages et un formulaire de contact. L'espace
d'administration permet de gérer chacun de ces contenus, d'envoyer des images,
de masquer une section et de suivre la fréquentation — sans jamais toucher au
code.

Développé par **Soro Z. Ebenezer**, développeur full stack et ingénieur
informatique (développement web et mobile, cybersécurité, intelligence
artificielle, réseau et cryptographie).

---

## Ce que contient le site

### Côté visiteur

| Section | Contenu |
|---------|---------|
| Accueil | Nom, titre, présentation, liens sociaux, photo sur orbe animée |
| À propos | Biographie, illustration et compteurs animés (projets, années, technologies) |
| Services | Cartes à bordure dégradée, icône au choix |
| Compétences | Regroupées par domaine, filtrables, avec jauge de maîtrise |
| Parcours | Frise chronologique filtrable (expériences / formations) |
| Projets | Cartes filtrables par catégorie, page dédiée par projet |
| Publications | Contenus publiés ailleurs (LinkedIn, GitHub, Medium…) |
| Blog | Articles en texte riche, page dédiée par article |
| FAQ | Questions fréquentes en accordéon |
| Témoignages | Carrousel automatique |
| Contact | Coordonnées et formulaire, sur fond de ciel étoilé |

Pages dédiées : `/`, `/projets`, `/projets/[slug]`, `/blog`, `/blog/[slug]`,
`/publications`, `/contact`.

Thème clair et sombre, mise en page adaptée jusqu'à **320 px de large**, et
animations d'entrée confinées pour qu'aucune ne déborde de l'écran.

### Côté administration

Quinze écrans, tous en français :

| Écran | Rôle |
|-------|------|
| Tableau de bord | Statistiques de fréquentation et raccourcis |
| Profil | Identité, contact, photos, logo, CV |
| Projets · Blog | Éditeur pleine page, texte riche, images, galerie, étiquettes |
| Compétences | Niveau par compétence, catégories libres |
| Expériences · Services · Témoignages · FAQ | Création, édition, ordre, publication |
| Réseaux | Liens sociaux et publications partagées, réordonnables |
| Messages | Messages reçus via le formulaire de contact |
| Médiathèque | Fichiers envoyés (images, PDF), avec aperçu et suppression |
| Paramètres | Nom du site, compteurs, **visibilité de chaque section d'accueil** |

L'administration a sa propre palette, déclinée en clair et en sombre, et reste
utilisable depuis un téléphone.

---

## Composition technique

### Pile technique

| Domaine | Choix |
|---------|-------|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19 |
| Langage | TypeScript |
| Style | Tailwind CSS 3 sur une couche de jetons CSS |
| Base de données | PostgreSQL via Prisma 6 |
| Authentification | NextAuth.js v5 (Auth.js), session JWT de 8 heures, mots de passe bcrypt |
| Validation | Zod 4, partagée entre le CMS et le seed |
| Animations | Framer Motion, GSAP, Three.js / React Three Fiber (ciel étoilé, billes de compétences) |
| Éditeur | Tiptap 3 |
| Fichiers | Vercel Blob, images retraitées par sharp |
| Interface | Radix UI, lucide-react, react-hot-toast, next-themes |

### Arborescence

```
prisma/
├─ schema.prisma          Modèle de données
├─ migrations/            Migrations SQL
├─ seed.ts                Injection des informations (transactionnelle)
└─ donnees/               Questionnaire, schéma du fichier, exemple
public/                   Ressources statiques (favicons, images, uploads locaux)
src/
├─ app/
│  ├─ (public)/           Site public
│  ├─ admin/              Connexion et panneau d'administration
│  ├─ api/                Auth, contact, envoi de fichiers, suivi de visites
│  ├─ layout.tsx          Métadonnées globales, thème, polices
│  ├─ sitemap.ts          Sitemap dynamique
│  ├─ robots.ts           robots.txt
│  └─ opengraph-image.tsx Image de partage générée
├─ components/
│  ├─ public/             Sections du site
│  ├─ admin/              Écrans de gestion, éditeur riche, médiathèque
│  ├─ canvas/             Rendus Three.js
│  ├─ seo/                Données structurées JSON-LD
│  ├─ ui/                 Boutons, champs, fenêtres, badges…
│  └─ providers/          Thème, session, notifications
├─ lib/
│  ├─ actions/            Server Actions du CMS, protégées par assertAdmin
│  ├─ auth.ts             Configuration NextAuth
│  ├─ queries.ts          Lectures publiques, tolérantes à une base absente
│  ├─ upload.ts           Stockage des fichiers (Blob ou disque en local)
│  ├─ televersement.ts    Préparation des images côté navigateur
│  ├─ validations.ts      Schémas Zod
│  ├─ rate-limit.ts       Limitation par adresse IP
│  ├─ sections.ts         Sections masquables de l'accueil
│  └─ site.ts             URL publique du site
├─ styles/                Jetons de couleur (site) et thème du back-office
├─ hooks/                 Hooks réutilisables
├─ types/                 Types partagés
└─ middleware.ts          Protection des routes admin, CSP par requête
```

### Charte graphique

Toutes les couleurs passent par des **jetons CSS** (`--bg-*`, `--text-*`,
canaux `--c-*`). La palette dérive du logo : noirs `#0D0D0D` et `#1A1A1A`, or
`#D4AF37`, éclat `#E5E555`. Changer la palette revient à modifier
`src/styles/tokens.css` ; aucun composant n'a de couleur en dur.
`src/styles/admin.css` redéfinit ces mêmes jetons pour le back-office, en clair
et en sombre.

---

## Sécurité

- **Politique de sécurité du contenu** stricte, avec un *nonce* par requête et
  `strict-dynamic` : aucun script en ligne non signé ne s'exécute.
- **En-têtes** : `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, et HSTS en production.
- **Administration discrète** : aucun lien n'y mène depuis le site. On y accède
  par le raccourci **Ctrl + Alt + E** ou par l'adresse `/admin/login`. Elle est
  exclue des moteurs de recherche par `X-Robots-Tag` et une balise meta, sans
  être citée dans `robots.txt` — qui trahirait son adresse.
- **Connexion** : 5 tentatives par quart d'heure et par adresse IP, message
  d'erreur unique quelle que soit la cause, formulaire en `POST` et bouton
  inactif tant que la page n'est pas prête (un envoi natif aurait placé le mot
  de passe dans l'URL).
- **Écritures** : chaque Server Action vérifie la session administrateur, et
  chaque entrée est validée par un schéma Zod.
- **Formulaire de contact** : 5 messages par heure et par IP, corps de requête
  borné, validation stricte.
- **Fichiers envoyés** : types et tailles contrôlés, images retraitées par
  sharp, suppression du fichier distant avec la fiche média.
- **Contenu riche** : à l'affichage, seuls les liens `https`, `http`, `mailto`,
  `tel` ou internes sont rendus ; les sources d'image sont filtrées de la même
  façon.

---

## Référencement

- Titre, description et aperçus de partage **construits depuis le profil du
  CMS** : les modifier dans l'administration met à jour le référencement.
- URL canoniques sur chaque page, sitemap dynamique incluant projets et
  articles publiés, `robots.txt` généré.
- Données structurées JSON-LD : `Person` et `WebSite` sur l'accueil,
  `BlogPosting` sur un article, `CreativeWork` sur un projet.
- Image de partage 1200 × 630 générée à la volée.
- L'adresse publique utilisée par le sitemap et les partages suit
  `NEXT_PUBLIC_SITE_URL`, à défaut le domaine de production Vercel.

---

## Accessibilité et qualité

- Contraste vérifié texte par texte sur les écrans d'administration, dans les
  deux modes, au niveau **AA** (4,5:1, ou 3:1 pour les grands textes).
- Libellés reliés à leurs champs, focus visible, `prefers-reduced-motion`
  respecté, navigation au clavier.
- Intégration continue GitHub (`.github/workflows/ci.yml`) : lint, types et
  build à chaque push et chaque pull request sur `main`.

---

## Démarrer en local

**Prérequis** : Node.js 18 ou plus (testé sur Node 24) et une base PostgreSQL.

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Renseigner `.env`**

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
   AUTH_SECRET="..."        # openssl rand -base64 32
   NEXTAUTH_SECRET="..."    # même valeur que AUTH_SECRET
   NEXTAUTH_URL="http://localhost:3000"
   ADMIN_EMAIL="..."        # compte administrateur créé par le seed
   ADMIN_PASSWORD="..."     # mot de passe long et unique
   BLOB_READ_WRITE_TOKEN="" # facultatif en local : sans lui, les images vont dans public/uploads
   ```

   > Base de test rapide : `npx prisma dev`, ou une base PostgreSQL hébergée.

3. **Préparer la base**

   ```bash
   npm run db:generate     # client Prisma
   npm run db:migrate      # tables
   npm run db:seed         # compte administrateur + contenus
   ```

4. **Lancer le serveur**

   ```bash
   npm run dev             # http://localhost:3000
   ```

   - Site public : `/`
   - Administration : **Ctrl + Alt + E** depuis n'importe quelle page (inactif
     dans un champ de saisie), ou `/admin/login`. Identifiants : `ADMIN_EMAIL`
     et `ADMIN_PASSWORD`. Le seed ne réinitialise jamais un mot de passe changé
     depuis l'administration.

---

## Remplir le site avec ses informations

Ouvrir `prisma/donnees/formulaire.html` (double-clic) : un questionnaire pose
une question à la fois, fonctionne hors ligne et produit `mes-infos.json`.
Placer ce fichier dans `prisma/donnees/`, puis :

```bash
npm run db:injecter:simulation   # essai à blanc : tout est écrit puis annulé
npm run db:injecter              # injection réelle, en une seule transaction
```

Chaque rubrique peut être remplacée, vidée ou laissée intacte. Détails et
garanties : [`prisma/donnees/LISEZ-MOI.md`](prisma/donnees/LISEZ-MOI.md).

Tout reste ensuite modifiable depuis l'administration, et chaque section de la
page d'accueil peut y être masquée sans perdre son contenu.

---

## Déploiement (Vercel)

Le déploiement suit l'intégration Git de Vercel : chaque push sur `main` est
déployé, après le passage de la CI GitHub.

Variables à définir dans **Vercel › Settings › Environment Variables** :

| Variable | Rôle |
|----------|------|
| `DATABASE_URL` | Base PostgreSQL de production |
| `AUTH_SECRET`, `NEXTAUTH_SECRET` | Signature des sessions (`openssl rand -base64 32`), même valeur pour les deux — et **jamais** celle d'un ancien `.env` |
| `NEXTAUTH_URL` | Adresse publique du site, par exemple `https://mon-domaine.com` |
| Stockage des images | **Indispensable aux images.** Connecter un stockage **Storage › Blob** au projet suffit : la connexion fournit `BLOB_STORE_ID`, et le SDK s'authentifie par le jeton OIDC de l'exécution. Une variable `BLOB_READ_WRITE_TOKEN` reste possible (utile hors de Vercel). Sans l'un ni l'autre, tout envoi d'image échoue en ligne, et la médiathèque l'indique. |
| `NEXT_PUBLIC_SITE_URL` | Facultatif : domaine personnalisé pour les URL canoniques, le sitemap et les partages. À défaut, le domaine de production Vercel est utilisé. |

Après tout changement de variable : **Redeploy**. Un changement de secret
déconnecte les sessions en cours.

Les images envoyées depuis l'administration sont réduites dans le navigateur
avant l'envoi — Vercel refuse les requêtes de plus de 4,5 Mo — puis converties
en WebP par le serveur et stockées sur Vercel Blob.

---

## Scripts

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed : compte administrateur et contenus |
| `npm run db:injecter` | Injection de `mes-infos.json` (accepte `-- --fichier <chemin>`) |
| `npm run db:injecter:simulation` | Essai à blanc de l'injection, rien n'est écrit |
| `npm run db:studio` | Prisma Studio |
| `npm run format` | Prettier |
