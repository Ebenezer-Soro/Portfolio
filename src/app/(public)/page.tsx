import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { SocialPostsSection } from "@/components/public/SocialPostsSection";
import { BlogSection } from "@/components/public/BlogSection";
import { FAQSection } from "@/components/public/FAQSection";
import { ContactSection } from "@/components/public/ContactSection";
import { ProcessSection } from "@/components/public/ProcessSection";
import { TechMarquee } from "@/components/public/TechMarquee";
import { CtaBanner } from "@/components/public/CtaBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { sectionVisible } from "@/lib/sections";
import {
  getProfile,
  getSettings,
  getSkills,
  getExperiences,
  getPublishedProjects,
  getServices,
  getTestimonials,
  getSocialPosts,
  getPublishedPosts,
  getFaqs,
  getSocialLinks,
} from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Texte nu : les données structurées n'acceptent ni balise ni
 *  retour à la ligne décoratif. */
function enTexte(valeur: string): string {
  return valeur.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Phrase entière, 160 caractères au plus : au-delà, les moteurs
 *  coupent au milieu d'un mot. */
function resumerPour(texte: string): string {
  const t = enTexte(texte);
  return t.length <= 160 ? t : t.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

export default async function HomePage() {
  const [
    profile,
    settings,
    skills,
    experiences,
    projects,
    services,
    testimonials,
    socialPosts,
    posts,
    faqs,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getSettings(),
    getSkills(),
    getExperiences(),
    getPublishedProjects(),
    getServices(),
    getTestimonials(),
    getSocialPosts(true),
    getPublishedPosts(3),
    getFaqs(),
    getSocialLinks(),
  ]);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    jobTitle: profile.title,
    description: profile.bio,
    ...(absoluteUrl(profile.photoUrl) ? { image: absoluteUrl(profile.photoUrl) } : {}),
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    ...(profile.location
      ? { address: { "@type": "PostalAddress", addressLocality: profile.location } }
      : {}),
    ...(skills.length ? { knowsAbout: skills.map((s) => s.name) } : {}),
    ...(socialLinks.length ? { sameAs: socialLinks.map((l) => l.url) } : {}),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} — Portfolio`,
    url: SITE_URL,
    inLanguage: "fr-FR",
  };

  /*
   * Données structurées — émises UNIQUEMENT si la rubrique est visible.
   * Décrire à Google une FAQ que le visiteur ne trouvera pas sur la page
   * est un motif de sanction, pas un gain de référencement.
   */
  const faqLd =
    sectionVisible(settings, "faq") && faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: enTexte(f.answer) },
          })),
        }
      : null;

  /*
   * `Person` dit qui écrit. `ProfessionalService` dit qu'il y a une
   * prestation derrière, ce qu'elle couvre et comment la demander :
   * c'est ce type-là que Google interroge sur les requêtes de service.
   */
  const serviceLd =
    sectionVisible(settings, "services") && services.length
      ? {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: profile.name,
          url: SITE_URL,
          description: resumerPour(profile.bio),
          ...(absoluteUrl(profile.photoUrl) ? { image: absoluteUrl(profile.photoUrl) } : {}),
          ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
          ...(profile.location
            ? {
                address: { "@type": "PostalAddress", addressLocality: profile.location },
                areaServed: profile.location,
              }
            : {}),
          serviceType: services.map((s) => s.title),
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: `${SITE_URL}/contact`,
            availableLanguage: ["fr"],
          },
        }
      : null;

  // Visibilité pilotée depuis l'admin (Paramètres → Sections de l'accueil).
  // Une section reste par ailleurs masquée si elle n'a aucun contenu : les
  // deux conditions se cumulent.
  const affiche = (id: Parameters<typeof sectionVisible>[1]) =>
    sectionVisible(settings, id);

  /* Numérotation des sections, calculée à l'affichage.
     Les index étaient écrits en dur dans chaque composant. Or le CMS
     permet de masquer n'importe quelle rubrique : trois sections
     cachées suffisaient à produire une suite trouée (01, 02, 03, 05,
     06, 09, 11), qui se lit comme un défaut. Le compteur n'avance que
     pour les sections réellement rendues. */
  let compteur = 0;
  const num = () => String(++compteur).padStart(2, "0");

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      {faqLd && <JsonLd data={faqLd} />}
      {serviceLd && <JsonLd data={serviceLd} />}

      {/*
        L'ordre suit le parcours d'un visiteur : qui je suis, ce que je
        sais faire, ce que j'ai fait, COMMENT je travaille, d'où je
        viens, puis ce que j'écris — et enfin la prise de contact. La
        méthode est placée juste après les réalisations : c'est là que
        la question « et concrètement, ça se passe comment ? » arrive.

        Chaque section porte sa propre cascade d'animation
        (SectionShell + variantes `fadeIn`). Une section sur deux est
        posée sur une « plage » — un grand panneau arrondi — ce qui
        donne son rythme à la page sans alterner des fonds pleine
        largeur.
      */}
      <HeroSection profile={profile} socialLinks={socialLinks} settings={settings} />
      <TechMarquee skills={skills} />
      {affiche("about") && <AboutSection profile={profile} settings={settings} index={num()} />}
      {affiche("services") && <ServicesSection services={services} index={num()} />}
      {affiche("skills") && <SkillsSection skills={skills} index={num()} />}
      {affiche("projects") && <ProjectsSection projects={projects} index={num()} />}
      <ProcessSection index={num()} />
      {affiche("experience") && <ExperienceSection experiences={experiences} index={num()} />}
      {affiche("publications") && <SocialPostsSection posts={socialPosts} index={num()} />}
      {affiche("blog") && <BlogSection posts={posts} index={num()} />}
      {affiche("faq") && <FAQSection faqs={faqs} index={num()} />}
      {affiche("testimonials") && (
        <TestimonialsSection testimonials={testimonials} settings={settings} indexSection={num()} />
      )}
      {affiche("contact") && <ContactSection profile={profile} index={num()} />}
      <CtaBanner email={profile.email} />
    </>
  );
}
