import { HeroSection } from "@/components/public/HeroSection";
import { RevealSection } from "@/components/public/RevealSection";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl } from "@/lib/site";
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

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      <HeroSection profile={profile} socialLinks={socialLinks} />
      <RevealSection variant="up">
        <AboutSection profile={profile} settings={settings} />
      </RevealSection>
      <RevealSection variant="right">
        <SkillsSection skills={skills} />
      </RevealSection>
      <RevealSection variant="left">
        <ExperienceSection experiences={experiences} />
      </RevealSection>
      <RevealSection variant="zoom">
        <ProjectsSection projects={projects} />
      </RevealSection>
      <RevealSection variant="up">
        <ServicesSection services={services} />
      </RevealSection>
      <RevealSection variant="right">
        <TestimonialsSection testimonials={testimonials} />
      </RevealSection>
      <RevealSection variant="left">
        <SocialPostsSection posts={socialPosts} />
      </RevealSection>
      <RevealSection variant="zoom">
        <BlogSection posts={posts} />
      </RevealSection>
      <RevealSection variant="up">
        <FAQSection faqs={faqs} />
      </RevealSection>
      <RevealSection variant="up">
        <ContactSection profile={profile} />
      </RevealSection>
    </>
  );
}
