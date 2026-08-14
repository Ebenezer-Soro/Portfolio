"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { TiltCard } from "./TiltCard";
import { GradientCard } from "./GradientCard";
import { fadeIn } from "@/lib/motion";
import type { Service } from "@prisma/client";

export function ServicesSection({ services }: { services: Service[] }) {
  const reduce = useReducedMotion();
  if (!services.length) return null;

  return (
    <SectionShell id="services" className="bg-[var(--bg-primary)]">
      <SectionHeading
        eyebrow="Services"
        title="Ce que je propose"
        description="Des prestations sur mesure pour donner vie à vos projets."
        align="left"
      />

      {/* Cartes du modèle : bordure 1px en dégradé, surface opaque,
          inclinaison au survol, arrivée échelonnée par la droite. */}
      <div className="flex flex-wrap gap-10">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            variants={reduce ? undefined : fadeIn("right", "spring", i * 0.3, 0.75)}
            className="w-full xs:w-[250px]"
          >
            <TiltCard>
              <GradientCard innerClassName="flex min-h-[280px] flex-col items-center justify-evenly px-8 py-5 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent2 text-white shadow-[var(--shadow-sky)]">
                  <Icon name={service.iconName} size={30} />
                </span>
                <h3 className="font-display text-[20px] font-bold text-[var(--text-primary)]">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{service.description}</p>
              </GradientCard>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
