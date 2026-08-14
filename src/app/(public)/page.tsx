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
import { StarsCanvas } from "@/components/canvas/StarsCanvas";
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

  // Visibilité pilotée depuis l'admin (Paramètres → Sections de l'accueil).
  // Une section reste par ailleurs masquée si elle n'a aucun contenu : les
  // deux conditions se cumulent.
  const affiche = (id: Parameters<typeof sectionVisible>[1]) =>
    sectionVisible(settings, id);

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />

      {/*
        Les sections portent désormais leur propre cascade d'animation
        (SectionShell + variantes `fadeIn`), reprise du modèle. L'ancien
        `RevealSection`, qui animait le bloc entier avec un flou, entrait en
        concurrence avec elle : les deux effets se superposaient. Une seule
        grammaire de mouvement suffit.
      */}
      <HeroSection profile={profile} socialLinks={socialLinks} />
      {affiche("about") && <AboutSection profile={profile} settings={settings} />}
      {affiche("services") && <ServicesSection services={services} />}
      {affiche("skills") && <SkillsSection skills={skills} />}
      {affiche("experience") && <ExperienceSection experiences={experiences} />}
      {affiche("projects") && <ProjectsSection projects={projects} />}
      {affiche("publications") && <SocialPostsSection posts={socialPosts} />}
      {affiche("blog") && <BlogSection posts={posts} />}
      {affiche("faq") && <FAQSection faqs={faqs} />}

      {/* Bloc final sur ciel étoilé, comme dans le modèle : le champ
          d'étoiles n'habille que la fin de page. */}
      <div className="relative z-0 bg-[var(--bg-secondary)]">
        <StarsCanvas />
        <div className="relative z-10">
          {affiche("testimonials") && (
            <TestimonialsSection testimonials={testimonials} />
          )}
          {affiche("contact") && <ContactSection profile={profile} />}
        </div>
      </div>
    </>
  );
}
