import Image from "next/image";
import type { Skill } from "@prisma/client";

/**
 * Ruban de technologies — une bande qui défile en continu, juste sous
 * l'accueil. Elle dit en trois secondes avec quoi on travaille, là où
 * la section « compétences » le dit en détail plus bas.
 *
 * Le contenu est DUPLIQUÉ et la translation s'arrête à -50 % (voir
 * `.ruban` dans globals.css) : la seconde copie arrive exactement là où
 * était la première, donc la boucle est invisible.
 */
export function TechMarquee({ skills }: { skills: Skill[] }) {
  // Sans logo, un jeton n'est qu'un mot de plus : le ruban vit de ses
  // images, pas de sa liste.
  const avecLogo = skills.filter((s) => s.iconUrl);
  if (avecLogo.length < 4) return null;

  const serie = [...avecLogo, ...avecLogo];

  return (
    <div className="ruban" aria-hidden>
      <div className="defile">
        {serie.map((skill, i) => (
          <span key={`${skill.id}-${i}`} className="flex flex-none items-center gap-2.5">
            <Image
              src={skill.iconUrl as string}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain opacity-65 saturate-[0.25] transition-[filter,opacity] duration-300 hover:opacity-100 hover:saturate-100"
            />
            <span className="whitespace-nowrap font-display text-[15px] font-semibold tracking-[-0.01em] text-[var(--text-muted)]">
              {skill.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
