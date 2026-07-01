import Image from "next/image";
import { Download } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { Counter } from "./Counter";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@prisma/client";

export function AboutSection({
  profile,
  settings,
}: {
  profile: Profile;
  settings: Record<string, string>;
}) {
  const stats = [
    { label: "Projets réalisés", value: Number(settings.stats_projects ?? 15), suffix: "+" },
    { label: "Années d'expérience", value: Number(settings.stats_years ?? 3), suffix: "+" },
    { label: "Technologies maîtrisées", value: Number(settings.stats_techs ?? 20), suffix: "+" },
  ];

  return (
    <section id="about" className="section-pad bg-[var(--bg-primary)]">
      <div className="container-page">
        <SectionHeading eyebrow="À propos" title="Qui suis-je ?" />

        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--border)] shadow-[var(--shadow-lg)]">
              {profile.aboutPhotoUrl || profile.photoUrl ? (
                <Image
                  src={(profile.aboutPhotoUrl || profile.photoUrl) as string}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-accent to-accent2 font-display text-8xl font-bold text-white">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                {profile.bio}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center md:text-left">
                    <Counter value={s.value} suffix={s.suffix} />
                    <p className="mt-1 text-xs text-[var(--text-muted)] md:text-sm">{s.label}</p>
                  </div>
                ))}
              </div>

              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">
                    <Download className="h-4 w-4" /> Télécharger mon CV
                  </Button>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
