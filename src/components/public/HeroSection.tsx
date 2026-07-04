"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Particles } from "./Particles";
import { SocialLinks } from "./SocialLinks";
import type { Profile, SocialLink } from "@prisma/client";

export function HeroSection({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
      tl.from(".hero-badge", { opacity: 0, y: 20 })
        .from(".hero-greeting", { opacity: 0, y: 20 }, "-=0.45")
        .from(".hero-name", { opacity: 0, y: 24 }, "-=0.45")
        .from(".hero-title", { opacity: 0, y: 24 }, "-=0.45")
        .from(".hero-subtitle", { opacity: 0, y: 20 }, "-=0.45")
        .from(".hero-cta", { opacity: 0, y: 20, stagger: 0.15 }, "-=0.4")
        .from(".hero-social", { opacity: 0, y: 16 }, "-=0.4")
        .from(".hero-photo", { opacity: 0, scale: 0.85, duration: 0.9 }, "-=1.1");
    },
    { scope: container },
  );

  return (
    <section
      id="accueil"
      ref={container}
      className="gradient-mesh relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 text-white"
    >
      <Particles />
      {/* Blobs animés */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 animate-float rounded-full bg-primary/30 blur-3xl" />
      <div
        className="pointer-events-none absolute right-0 top-10 h-80 w-80 animate-float rounded-full bg-accent/30 blur-3xl"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 animate-float rounded-full bg-accent2/25 blur-3xl"
        style={{ animationDelay: "0.6s" }}
      />

      <div className="container-page relative z-10 grid items-center gap-12 md:grid-cols-2">
        <div className="relative z-20 order-2 text-center md:order-1 md:text-left">
          {profile.isAvailable && (
            <span className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Disponible pour de nouveaux projets
            </span>
          )}

          <p className="hero-greeting text-lg text-sky-200">Bonjour, je suis</p>
          <h1 className="hero-name mt-1 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="hero-title mt-3 font-display text-xl font-semibold text-gradient animate-gradient-text md:text-2xl">
            {profile.title}
          </p>
          <p className="hero-subtitle mt-5 max-w-xl text-base text-slate-300 md:mx-0 mx-auto">
            {profile.bio}
          </p>

          <div className="hero-cta mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link href="/projets">
              <Button size="lg" variant="gradient">
                Voir mes projets <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {profile.cvUrl && (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary">
                  <Download className="h-4 w-4" /> Télécharger CV
                </Button>
              </a>
            )}
          </div>

          <div className="hero-social mt-8 flex justify-center md:justify-start">
            <SocialLinks links={socialLinks} />
          </div>
        </div>

        {/* Photo artistique : formes en arrière-plan + photo flottante détourée */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="hero-photo relative flex h-[22rem] w-[17rem] items-center justify-center sm:h-[28rem] sm:w-[24rem] lg:h-[32rem] lg:w-[26rem]">
            {/* Halo conique rotatif (effet "wow") — déborde largement la photo */}
            <div
              className="absolute h-[28rem] w-[28rem] animate-spin-slow rounded-full opacity-70 blur-2xl sm:h-[34rem] sm:w-[34rem] lg:h-[42rem] lg:w-[42rem]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(14,165,233,0.55) 60deg, transparent 140deg, rgba(139,92,246,0.55) 220deg, transparent 320deg)",
              }}
            />
            {/* Anneau pointillé en rotation lente */}
            <div className="absolute h-[26rem] w-[26rem] animate-spin-slow rounded-full border-2 border-dashed border-sky-300/30 sm:h-[32rem] sm:w-[32rem] lg:h-[38rem] lg:w-[38rem]" />

            {/* Blob organique morphing (forme artistique) */}
            <div className="absolute h-[24rem] w-[24rem] animate-blob bg-gradient-to-br from-primary via-accent to-accent2 opacity-90 blur-[2px] sm:h-[29rem] sm:w-[29rem] lg:h-[34rem] lg:w-[34rem]" />
            {/* Blob secondaire décalé pour la profondeur */}
            <div
              className="absolute h-[22rem] w-[22rem] animate-blob bg-gradient-to-tr from-sky-400/60 to-violet-500/60 blur-3xl sm:h-[27rem] sm:w-[27rem] lg:h-[32rem] lg:w-[32rem]"
              style={{ animationDelay: "2s" }}
            />

            {/* Halo lumineux */}
            <div className="absolute h-[24rem] w-[24rem] animate-glow-pulse rounded-full sm:h-[29rem] sm:w-[29rem] lg:h-[34rem] lg:w-[34rem]" />

            {/* Petites formes flottantes — repoussées vers l'extérieur */}
            <div className="absolute -right-8 top-4 h-14 w-14 animate-float rounded-2xl border border-sky-300/40 bg-white/5 backdrop-blur-sm sm:-right-12" />
            <div
              className="absolute -left-8 bottom-12 h-11 w-11 rotate-45 animate-float border border-violet-300/40 bg-white/5 backdrop-blur-sm sm:-left-12"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute -right-4 bottom-10 h-3.5 w-3.5 animate-float rounded-full bg-sky-300/70"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute -left-4 top-16 h-2.5 w-2.5 animate-float rounded-full bg-violet-300/70"
              style={{ animationDelay: "1.5s" }}
            />

            {/* Photo détourée qui flotte au-dessus (pas de cercle) */}
            <div className="relative z-10 h-full w-full animate-float-slow">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, 416px"
                  className="object-contain object-bottom drop-shadow-[0_24px_45px_rgba(2,6,23,0.55)]"
                />
              ) : (
                <div className="flex h-full w-full items-end justify-center pb-6 font-display text-9xl font-bold text-white drop-shadow-[0_10px_30px_rgba(14,165,233,0.6)]">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Défiler vers le bas"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}
