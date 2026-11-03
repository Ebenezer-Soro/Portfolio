"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { Counter } from "./Counter";
import type { Testimonial } from "@prisma/client";

/**
 * Recommandations et chiffres partagent une rangée.
 *
 * Un témoignage isolé au milieu d'une page large paraît maigre ;
 * adossé aux chiffres, il devient une preuve parmi d'autres. Et si le
 * CMS n'a aucun témoignage, les chiffres tiennent la section à eux
 * seuls — la rubrique ne disparaît pas pour autant.
 */
export function TestimonialsSection({
  testimonials,
  settings,
  indexSection,
}: {
  testimonials: Testimonial[];
  settings: Record<string, string>;
  indexSection?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % Math.max(1, testimonials.length)),
    [testimonials.length],
  );
  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % Math.max(1, testimonials.length));

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next, testimonials.length]);

  const chiffres = [
    { valeur: Number(settings.stats_projects ?? 6), suffixe: "+", libelle: "Projets livrés" },
    { valeur: Number(settings.stats_live ?? 3), suffixe: "", libelle: "Plateformes en production" },
    { valeur: Number(settings.stats_years ?? 2), suffixe: "+", libelle: "Années de pratique" },
    { valeur: 48, suffixe: " h", libelle: "Délai de réponse" },
  ];

  const t = testimonials[index];

  return (
    <SectionShell id="testimonials" plage>
      <SectionHeading
        index={indexSection ?? "10"}
        eyebrow="Recommandations"
        title="Ce que disent celles et ceux avec qui je travaille."
        align="left"
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {t && (
          <div
            className="rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] p-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] shadow-card"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/*
              Piste de défilement CONFINÉE : les témoignages entrent et
              sortent par translation. Une transformation ne modifie pas
              la mise en page, mais elle compte dans la zone de
              débordement défilable — sans confinement, la page gagnait
              de la largeur à chaque rotation. Le rembourrage compensé
              par une marge négative laisse respirer l'ombre portée.
            */}
            <div className="relative -m-3 min-h-[15rem] overflow-hidden p-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.4 }}
                >
                  <Quote className="mb-4 h-8 w-8 text-primary/40" />
                  <p className="font-display text-xl font-normal leading-[1.55] text-[var(--text-primary)] sm:text-2xl">
                    “{t.content}”
                  </p>
                  <div className="mt-6 flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < t.rating ? "h-4 w-4 fill-current" : "h-4 w-4 text-[var(--text-muted)]"
                        }
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3.5">
                    <Avatar src={t.avatarUrl} alt={t.name} className="h-11 w-11" />
                    <div>
                      <p className="font-display font-semibold text-[var(--text-primary)]">{t.name}</p>
                      <p className="mono-label text-[10px]">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {testimonials.length > 1 && (
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={prev}
                  aria-label="Précédent"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Témoignage ${i + 1}`}
                      aria-current={i === index}
                      className={
                        i === index
                          ? "h-0.5 w-10 bg-primary transition-all"
                          : "h-0.5 w-6 bg-[var(--border-strong)] transition-all"
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Suivant"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className={t ? undefined : "lg:col-span-2"}>
          <p className="mono-label mb-4">En chiffres</p>
          <div className="grid grid-cols-2 gap-3.5">
            {chiffres.map((c) => (
              <div
                key={c.libelle}
                className="rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] p-6 text-center shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/50 hover:shadow-[var(--shadow-md),var(--glow-primary)]"
              >
                <Counter value={c.valeur} suffix={c.suffixe} />
                <p className="mono-label mt-2.5 text-[10px]">{c.libelle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
