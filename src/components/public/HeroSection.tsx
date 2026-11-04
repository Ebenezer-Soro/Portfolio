"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Briefcase, Code2, Globe, Layers, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SystemScene } from "@/components/canvas/SystemScene";
import { SocialLinks } from "./SocialLinks";
import type { Profile, SocialLink } from "@prisma/client";

/**
 * Accueil — deux colonnes : à gauche la parole, à droite l'ouvrage.
 *
 * La colonne de droite accueille l'illustration du système, ENTOURÉE de
 * cartes de chiffres qui flottent. C'est la disposition que les bons
 * portfolios emploient autour d'un portrait ; faute de portrait dans le
 * CMS, le schéma tient ce rôle et les chiffres donnent au bloc le poids
 * qu'une photo lui aurait donné.
 */
export function HeroSection({
  profile,
  socialLinks,
  settings,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
  settings: Record<string, string>;
}) {
  const container = useRef<HTMLDivElement>(null);

  const chiffres = [
    { icone: Layers, valeur: settings.stats_projects ?? "6", libelle: "Projets livrés", classe: "cf-1" },
    { icone: Briefcase, valeur: settings.stats_years ?? "2", libelle: "Années de pratique", classe: "cf-2" },
    { icone: Code2, valeur: settings.stats_techs ?? "5", libelle: "Technologies clés", classe: "cf-3" },
  ];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
      tl.from(".hero-name", { opacity: 0, y: 24 })
        .from(".hero-title", { opacity: 0, y: 24 }, "-=0.5")
        .from(".hero-subtitle", { opacity: 0, y: 20 }, "-=0.45")
        .from(".hero-cta", { opacity: 0, y: 20 }, "-=0.4")
        .from(".hero-social", { opacity: 0, y: 16 }, "-=0.45")
        .from(".hero-pied", { opacity: 0, y: 16 }, "-=0.5")
        .from(".hero-scene", { opacity: 0, duration: 1.1 }, "-=1.3");
    },
    { scope: container },
  );

  return (
    <section
      id="accueil"
      ref={container}
      className="gradient-mesh relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20"
    >
      <div aria-hidden className="trame" />
      <div aria-hidden className="aube" />

      <div className="container-page relative z-10 grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
        <div>
          <h1 className="hero-head-text text-[var(--text-primary)]">
            <span className="hero-name block">{profile.name}</span>
            <span className="hero-title mot-accent block">{profile.title}</span>
          </h1>

          <p className="hero-subtitle mt-6 max-w-xl text-[17px] leading-[30px] text-[var(--text-secondary)] sm:text-[19px] sm:leading-[32px]">
            {profile.bio}
          </p>

          <div className="hero-cta mt-9 flex flex-wrap items-center gap-3.5">
            <Link href="/projets">
              <Button size="lg" variant="primary">
                Voir mes réalisations
                <span className="rond" aria-hidden>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Démarrer un échange
              </Button>
            </Link>
          </div>

          <div className="hero-social mt-9 flex">
            <SocialLinks links={socialLinks} />
          </div>

          <div className="hero-pied mono-label mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border)] pt-6">
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {profile.location}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4" /> Freelance · à distance
            </span>
          </div>
        </div>

        {/*
          Le bloc englobe la scène ET la rangée de chiffres : au-delà de
          1024 px les cartes se détachent et flottent autour du schéma ;
          en dessous elles redeviennent une rangée sous lui, car il n'y a
          plus la place de les faire flotter.
        */}
        <div className="hero-scene relative">
          <div className="relative mx-auto aspect-square w-[min(32rem,88vw)] lg:w-[min(36rem,42vw)]">
            {/* Auréole : elle détache la scène du fond et rattrape
                l'absence de sujet photographié. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[6%] rounded-full blur-[14px]"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--c-accent2) / 0.16) 0%, rgb(var(--c-primary) / 0.08) 38%, transparent 68%)",
              }}
            />
            <SystemScene />
            <span className="mono-label absolute left-0 top-[2%] hidden text-[10px] lg:block">
              Fig. 01 — ce que je construis
            </span>
          </div>

          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3 lg:mt-0 lg:contents">
            {chiffres.map(({ icone: Icone, valeur, libelle, classe }, i) => (
              <div
                key={libelle}
                className={`carte-flottante animate-levitation ${classe}`}
                style={{ animationDelay: `${-i * 2.3}s` }}
              >
                <span className="ecusson h-9 w-9">
                  <Icone className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="valeur">
                    {valeur}
                    <span className="text-primary">+</span>
                  </span>
                  <span className="libelle">{libelle}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite de défilement : un filet qui descend en boucle. */}
      <div aria-hidden className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="mono-label text-[9px]">Défiler</span>
        <span className="tube-defilement" />
      </div>
    </section>
  );
}
