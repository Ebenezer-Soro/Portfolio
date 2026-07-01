import { Icon } from "@/components/ui/Icon";
import { Reveal, SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import type { Service } from "@prisma/client";

export function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section id="services" className="section-pad relative overflow-hidden bg-[var(--bg-primary)]">
      <SectionDecor variant="primary" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Services"
          title="Ce que je propose"
          description="Des prestations sur mesure pour donner vie à vos projets."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-400 hover:shadow-[0_12px_40px_rgba(14,165,233,0.18)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-[var(--shadow-sky)] transition-transform group-hover:scale-110">
                  <Icon name={service.iconName} size={24} />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
