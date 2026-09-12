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
        .from(".hero-greeting", { opacity: 0, y: 20 }, "-=0.6")
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
            L'image de l'accueil n'est pas forcément une photo détourée : ce
            peut être une illustration rectangulaire, avec son propre fond.
            Elle est donc présentée DANS UN CADRE, en `object-contain` : rien
            n'est rogné, et les bandes éventuelles se fondent dans le fond
            sombre du cadre. Le décor se limite à un balayage lumineux et à
            un halo — une tache pleine donnait l'impression d'une vignette
            collée sur une bulle dorée.

            Tout le décor est dimensionné en POURCENTAGE de ce conteneur, et
            le conteneur lui-même en `min(rem, vw)` : des tailles absolues ne
            connaîtraient que trois paliers, et déborderaient entre deux
            points de rupture.
          */}
          <div className="hero-photo relative flex aspect-square w-[min(26rem,78vw)] items-center justify-center md:w-[min(30rem,42vw)]">
            {/* Balayage doré : c'est lui que l'on perçoit tourner. */}
            <div
              aria-hidden
              className="absolute aspect-square w-[130%] animate-spin-slow rounded-full opacity-45 blur-3xl"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.5) 70deg, transparent 150deg, rgba(229,229,85,0.28) 235deg, transparent 330deg)",
              }}
            />
            {/* Halo fixe : détache le cadre du fond. */}
            <div
              aria-hidden
              className="absolute aspect-square w-[116%] rounded-full opacity-80 blur-2xl"
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 66%)",
              }}
            />
            <div
              aria-hidden
              className="absolute aspect-square w-[108%] animate-spin-slow rounded-full border border-dashed border-[#d4af37]/35"
              style={{ animationDirection: "reverse" }}
            />

            <div className="relative z-10 h-full w-full animate-float-slow rounded-[28px] border border-[#d4af37]/25 bg-white/[0.03] p-2 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.85)] backdrop-blur-[2px]">
              <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-[#0d0d0d]">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 78vw, 30rem"
                    className="object-contain"
                  />
                ) : (
                  <div className="hero-head-text flex h-full w-full items-center justify-center text-white/85">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
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
