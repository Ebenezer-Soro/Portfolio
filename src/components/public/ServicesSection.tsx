"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Service } from "@prisma/client";

/**
 * Les domaines, en cartes.
 *
 * Le PREMIER service est traité comme la discipline centrale : filet
 * d'accent permanent, halo discret, mention « Discipline centrale ».
 * Les suivants portent « Domaine complémentaire ». La hiérarchie se
 * voit avant d'avoir lu une ligne — et le vocabulaire reste honnête :
 * on n'annonce pas quatre expertises équivalentes.
 *
 * L'ordre vient du CMS (champ `order`) : c'est donc depuis l'admin que
 * se décide quelle discipline occupe la place centrale.
 */
export function ServicesSection({ services, index }: { services: Service[]; index?: string }) {
  if (!services.length) return null;

  return (
    <SectionShell id="services" plage>
      <SectionHeading
        index={index ?? "02"}
        eyebrow="Expertise"
        title="Un métier au centre, des domaines autour."
        description="Le développement d'applications est mon quotidien. Les autres domaines l'entourent et le servent — annoncés comme tels, sans esbroufe."
        align="left"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service, i) => {
          const noyau = i === 0;
          return (
            // Le survol vit sur l'article, les variantes sur le div qui
            // l'enveloppe : framer laisse un `transform` en ligne apres
            // l'entree, et un style en ligne l'emporte sur une classe
            // utilitaire — la carte ne se soulevait jamais.
            <motion.div
              key={service.id}
              variants={fadeIn("up", "spring", i * 0.12, 0.7)}
            >
            <article
              className={cn(
                "group relative flex h-full flex-col gap-[1.125rem] overflow-hidden rounded-3xl border p-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] shadow-card transition-all duration-300",
                "bg-[image:var(--nappe)] hover:-translate-y-1 hover:shadow-[var(--shadow-lg),var(--glow-primary)]",
                noyau
                  ? "border-primary/40 shadow-[var(--shadow-md),var(--glow-primary)]"
                  : "border-[var(--border)] hover:border-primary/55",
              )}
            >
              {/* Filet d'accent : permanent sur la discipline centrale,
                  déployé au survol sur les autres. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-[3px] origin-left bg-[image:var(--nappe-accent)] transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  noyau ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
              {noyau && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-2/5 -top-2/5 h-[80%] w-[80%] rounded-full opacity-0 dark:opacity-100"
                  style={{
                    background: "radial-gradient(circle, rgb(var(--c-primary) / 0.14), transparent 65%)",
                  }}
                />
              )}

              <div className="relative flex items-center justify-between gap-4">
                <span className="ecusson h-13 w-13 rounded-lg" style={{ width: "3.25rem", height: "3.25rem" }}>
                  <Icon name={service.iconName} size={26} />
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.16em]",
                    noyau
                      ? "bg-primary/10 text-primary"
                      : "border border-[var(--border)] text-[var(--text-muted)]",
                  )}
                >
                  {noyau ? "Discipline centrale" : "Domaine complémentaire"}
                </span>
              </div>

              <h3 className="relative font-display text-2xl font-bold text-[var(--text-primary)]">
                {service.title}
              </h3>
              <p className="relative text-[15px] leading-[1.7] text-[var(--text-secondary)]">
                {service.description}
              </p>
            </article>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
