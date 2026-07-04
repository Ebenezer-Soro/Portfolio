import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin ──────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis (non vides) dans .env avant de lancer le seed.",
    );
  }
  const hash = await bcrypt.hash(adminPassword, 12);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hash,
      name: "Soro Z. Ebenezer",
    },
  });

  // ── Profil par défaut (singleton) ──────────────────────
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Soro Z. Ebenezer",
      title: "Développeur Full Stack & Ingénieur Informatique",
      bio: "Passionné par le développement web, la cybersécurité et l'intelligence artificielle. Je conçois des applications web performantes, élégantes et sécurisées, de l'idée jusqu'au déploiement.",
      email: "contact@soroebenezer.dev",
      phone: "+225 00 00 00 00",
      location: "Abidjan, Côte d'Ivoire",
      isAvailable: true,
    },
  });

  // ── Paramètres du site ─────────────────────────────────
  const settings = [
    { key: "site_name", value: "Soro Z. Ebenezer" },
    { key: "stats_projects", value: "15" },
    { key: "stats_years", value: "3" },
    { key: "stats_techs", value: "20" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // ── Compétences ────────────────────────────────────────
  const existingSkills = await prisma.skill.count();
  if (existingSkills === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "React / Next.js", level: 92, category: "Frontend", order: 1 },
        { name: "TypeScript", level: 88, category: "Frontend", order: 2 },
        { name: "Tailwind CSS", level: 90, category: "Frontend", order: 3 },
        { name: "Node.js", level: 85, category: "Backend", order: 1 },
        { name: "PostgreSQL / Prisma", level: 82, category: "Backend", order: 2 },
        { name: "Python", level: 80, category: "Backend", order: 3 },
        { name: "Docker", level: 75, category: "DevOps", order: 1 },
        { name: "CI/CD", level: 70, category: "DevOps", order: 2 },
        { name: "Pentest / OWASP", level: 78, category: "Sécurité", order: 1 },
        { name: "Cryptographie", level: 72, category: "Sécurité", order: 2 },
        { name: "LLM / RAG", level: 76, category: "IA", order: 1 },
        { name: "TensorFlow", level: 65, category: "IA", order: 2 },
      ],
    });
  }

  // ── Services ───────────────────────────────────────────
  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Développement Web Full Stack",
          description:
            "Conception d'applications web modernes, du front-end réactif au back-end robuste, avec une attention particulière à la performance et l'UX.",
          iconName: "Code",
          order: 1,
        },
        {
          title: "Audit & Sécurité",
          description:
            "Tests d'intrusion, audit de code et mise en conformité aux bonnes pratiques OWASP pour protéger vos applications.",
          iconName: "ShieldCheck",
          order: 2,
        },
        {
          title: "Intégration IA",
          description:
            "Intégration de modèles d'IA (chatbots, RAG, automatisation) au sein de vos produits pour décupler leur valeur.",
          iconName: "Sparkles",
          order: 3,
        },
        {
          title: "Conseil & Architecture",
          description:
            "Accompagnement technique, choix de stack et conception d'architectures scalables adaptées à vos besoins.",
          iconName: "Network",
          order: 4,
        },
      ],
    });
  }

  // ── Projets ────────────────────────────────────────────
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Plateforme E-commerce King",
          slug: "plateforme-ecommerce-king",
          description:
            "Boutique en ligne complète avec paiement, gestion de stock et tableau de bord administrateur.",
          tags: ["E-commerce", "SaaS"],
          techStack: ["Next.js", "PostgreSQL", "Stripe", "Prisma"],
          featured: true,
          published: true,
          order: 1,
        },
        {
          title: "Dashboard Analytics IA",
          slug: "dashboard-analytics-ia",
          description:
            "Tableau de bord temps réel avec prédictions basées sur le machine learning.",
          tags: ["Data", "IA"],
          techStack: ["React", "Python", "FastAPI", "TensorFlow"],
          featured: true,
          published: true,
          order: 2,
        },
        {
          title: "Scanner de Vulnérabilités",
          slug: "scanner-vulnerabilites",
          description:
            "Outil d'analyse automatisée de sécurité pour applications web suivant les standards OWASP.",
          tags: ["Sécurité", "CLI"],
          techStack: ["Python", "Docker", "PostgreSQL"],
          featured: false,
          published: true,
          order: 3,
        },
      ],
    });
  }

  // ── Expériences / Formations ───────────────────────────
  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    await prisma.experience.createMany({
      data: [
        {
          type: "work",
          title: "Développeur Full Stack",
          organization: "Freelance",
          location: "Abidjan, Côte d'Ivoire",
          startDate: new Date("2023-01-01"),
          current: true,
          description:
            "Conception et développement d'applications web sur mesure pour divers clients.",
          order: 1,
        },
        {
          type: "work",
          title: "Développeur Web Junior",
          organization: "Tech Solutions CI",
          location: "Abidjan",
          startDate: new Date("2022-01-01"),
          endDate: new Date("2022-12-31"),
          description: "Développement de sites vitrines et maintenance applicative.",
          order: 2,
        },
        {
          type: "education",
          title: "Ingénierie Informatique",
          organization: "Institut Polytechnique",
          location: "Abidjan",
          startDate: new Date("2019-09-01"),
          endDate: new Date("2022-07-01"),
          description: "Spécialisation en génie logiciel et systèmes d'information.",
          order: 1,
        },
      ],
    });
  }

  // ── Témoignages ────────────────────────────────────────
  const existingTesti = await prisma.testimonial.count();
  if (existingTesti === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Awa Koné",
          role: "CEO",
          company: "StartUp Abidjan",
          content:
            "Un travail remarquable, livré dans les délais avec un grand professionnalisme. Je recommande vivement.",
          rating: 5,
          published: true,
        },
        {
          name: "Jean Dupont",
          role: "CTO",
          company: "FinTech CI",
          content:
            "Une expertise technique solide et une excellente communication tout au long du projet.",
          rating: 5,
          published: true,
        },
      ],
    });
  }

  // ── Liens réseaux sociaux ──────────────────────────────
  const existingLinks = await prisma.socialLink.count();
  if (existingLinks === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "GitHub", url: "https://github.com", iconName: "Github", order: 1 },
        { platform: "LinkedIn", url: "https://linkedin.com", iconName: "Linkedin", order: 2 },
        { platform: "Twitter", url: "https://twitter.com", iconName: "Twitter", order: 3 },
      ],
    });
  }

  // ── Publications réseaux sociaux ───────────────────────
  const existingPosts = await prisma.socialPost.count();
  if (existingPosts === 0) {
    await prisma.socialPost.createMany({
      data: [
        {
          platform: "LinkedIn",
          title: "Comment sécuriser une API Next.js",
          description: "Mes meilleures pratiques pour protéger vos routes API.",
          url: "https://linkedin.com",
          featured: true,
          active: true,
          order: 1,
        },
        {
          platform: "GitHub",
          title: "Nouveau projet open-source",
          description: "Un starter kit Next.js + Prisma + Auth.",
          url: "https://github.com",
          featured: true,
          active: true,
          order: 2,
        },
      ],
    });
  }

  // ── Articles de blog ───────────────────────────────────
  const existingBlog = await prisma.post.count();
  if (existingBlog === 0) {
    await prisma.post.createMany({
      data: [
        {
          title: "Démarrer avec Next.js 14 et l'App Router",
          slug: "demarrer-nextjs-app-router",
          excerpt: "Guide pratique pour bien débuter avec le nouvel App Router de Next.js.",
          content: JSON.stringify({
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "L'App Router révolutionne la façon de construire des applications Next.js avec les Server Components.",
                  },
                ],
              },
            ],
          }),
          tags: ["Next.js", "Tutoriel"],
          published: true,
          featured: true,
          readingTime: 5,
        },
      ],
    });
  }

  // ── FAQ ────────────────────────────────────────────────
  const existingFaq = await prisma.fAQ.count();
  if (existingFaq === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "Quels types de projets réalisez-vous ?",
          answer:
            "Applications web full stack, plateformes SaaS, sites vitrines, intégrations d'IA et audits de sécurité.",
          order: 1,
        },
        {
          question: "Quels sont vos délais de réalisation ?",
          answer:
            "Cela dépend de la complexité du projet. Un site vitrine prend 1 à 2 semaines, une application complète plusieurs semaines.",
          order: 2,
        },
        {
          question: "Travaillez-vous à distance ?",
          answer: "Oui, je travaille avec des clients partout dans le monde, en remote.",
          order: 3,
        },
      ],
    });
  }

  console.log("✅ Seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
