"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
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
      tl.from(".hero-rail", { opacity: 0, scaleY: 0, transformOrigin: "top", duration: 0.9 })
        .from(".hero-badge", { opacity: 0, y: 20 }, "-=0.6")
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
      className="gradient-mesh relative flex min-h-screen items-center overflow-hidden pt-32 pb-20 text-white"
    >
      <Particles />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 sm:px-16 md:grid-cols-2">
        {/* Colonne texte, précédée du rail pointillé du modèle */}
        <div className="order-2 flex flex-row items-start gap-5 md:order-1">
          {/* Point doré + filet dégradé : le repère vertical du modèle */}
          <div className="mt-2 hidden flex-col items-center justify-center sm:flex">
            <div className="h-5 w-5 rounded-full bg-[#d4af37]" />
            <div className="hero-rail violet-gradient h-40 w-1 sm:h-72" />
          </div>

          <div className="flex-1">
            {profile.isAvailable && (
              <span className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Disponible pour de nouveaux projets
              </span>
            )}

            <p className="hero-greeting text-lg text-lavender-300">Bonjour, je suis</p>

            <h1 className="hero-head-text hero-name mt-1 text-white">
              {profile.name.split(" ").map((mot, i) =>
                i === 0 ? (
                  <span key={i} className="text-[#d4af37]">
                    {mot}{" "}
                  </span>
                ) : (
                  <span key={i}>{mot} </span>
                ),
              )}
            </h1>

            <p className="hero-sub-text hero-title mt-2 text-lavender-100">{profile.title}</p>

            <p className="hero-subtitle mt-5 max-w-xl text-[17px] leading-[30px] text-lavender-400">
              {profile.bio}
            </p>

            <div className="hero-cta mt-8 flex flex-wrap items-center gap-4">
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

            <div className="hero-social mt-8 flex">
              <SocialLinks links={socialLinks} />
            </div>
          </div>
        </div>

        {/* Photo flottante sur halo doré */}
        <div className="order-1 flex justify-center md:order-2">
          {/*
            Tout le décor est dimensionné en POURCENTAGE de ce conteneur, et
            le conteneur lui-même en `min(rem, vw)`. Les tailles absolues
            précédentes ne connaissaient que trois paliers : entre deux
            points de rupture l'orbe ne suivait plus la largeur de l'écran, et
            débordait franchement sous 380 px.
          */}
          <div className="hero-photo relative flex aspect-[13/16] w-[min(24rem,72vw)] items-center justify-center md:w-[min(26rem,38vw)]">
            <div
              className="absolute aspect-square w-[150%] animate-spin-slow rounded-full opacity-55 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.38) 60deg, transparent 140deg, rgba(229,229,85,0.22) 220deg, transparent 320deg)",
              }}
            />
            <div className="absolute aspect-square w-[138%] animate-spin-slow rounded-full border-2 border-dashed border-[#d4af37]/30" />
            <div className="absolute aspect-square w-[126%] animate-blob bg-gradient-to-br from-[#3a2e0d] via-[#8a6d1f] to-[#b8912b] opacity-70 blur-[3px]" />
            <div
              className="absolute aspect-square w-[114%] animate-blob bg-gradient-to-tr from-[#6b5417]/55 to-[#d4af37]/35 blur-3xl"
              style={{ animationDelay: "2s" }}
            />

            <div className="relative z-10 h-full w-full animate-float-slow">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, 416px"
                  className="object-contain object-bottom drop-shadow-[0_24px_45px_rgba(0,0,0,0.65)]"
                />
              ) : (
                <div className="hero-head-text flex h-full w-full items-end justify-center pb-6 text-white drop-shadow-[0_10px_30px_rgba(212,175,55,0.55)]">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement — la « souris » animée du modèle */}
      <div className="absolute bottom-8 flex w-full items-center justify-center xs:bottom-10">
        <a href="#about" aria-label="Défiler vers la section suivante">
          <div className="flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-lavender-400 p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="mb-1 h-3 w-3 rounded-full bg-lavender-400"
            />
          </div>
        </a>
      </div>
    </section>
  );
}
