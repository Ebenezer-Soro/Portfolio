"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, PenTool, Rocket, Search, ShieldCheck, Code2 } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { fadeIn } from "@/lib/motion";

/**
 * Le déroulé d'un projet, en six étapes.
 *
 * Ce contenu existait déjà — dans la FAQ, noyé dans un pavé de texte.
 * Montré plutôt que lu, il devient la section qui rassure un client
 * avant même qu'il pose la question. Il est volontairement écrit dans
 * le code : c'est la méthode de travail, pas une donnée éditoriale qui
 * change de semaine en semaine.
 */
const ETAPES = [
  {
    icone: Search,
    titre: "Analyse",
    detail: "Vos besoins, vos objectifs, vos contraintes et les fonctionnalités attendues.",
  },
  {
    icone: PenTool,
    titre: "Design",
    detail: "Structure des pages, navigation et identité visuelle — validés avant la moindre ligne de code.",
  },
  {
    icone: FileText,
    titre: "Cahier des charges",
    detail: "Un document écrit : fonctionnalités, architecture, dépendances, sécurité.",
  },
  {
    icone: Code2,
    titre: "Développement",
    detail: "Livraison progressive, avec quelque chose à regarder à chaque étape.",
  },
  {
    icone: ShieldCheck,
    titre: "Sécurisation",
    detail: "Contrôles de fonctionnement et audit de sécurité à chaque étape importante.",
  },
  {
    icone: Rocket,
    titre: "Mise en ligne",
    detail: "Déploiement, vérification en conditions réelles, remise avec ce qu'il faut pour l'exploiter.",
  },
];

export function ProcessSection({ index }: { index?: string }) {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="processus">
      <span className="mot-fantome top-8" aria-hidden>
        MÉTHODE
      </span>

      <SectionHeading
        index={index ?? "05"}
        eyebrow="Ma méthode"
        title="Six étapes, à chaque fois."
        description="Le même chemin du premier échange à la mise en production, dimensionné au projet. Vous validez chaque étape avant que la suivante ne commence."
        align="left"
      />

      <div className="processus">
        {ETAPES.map((etape, i) => (
          <motion.article
            key={etape.titre}
            className="etape-processus"
            variants={reduce ? undefined : fadeIn("up", "tween", i * 0.08, 0.6)}
          >
            <span className="pastille-etape">
              <etape.icone className="h-6 w-6" />
            </span>
            <div>
              <span className="mono-label mt-4 block text-[10px] text-primary max-[899px]:mt-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 font-display text-[17px] font-bold text-[var(--text-primary)]">
                {etape.titre}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {etape.detail}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
