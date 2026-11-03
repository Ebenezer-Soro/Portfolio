"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Réglage global du mouvement.
 *
 * `reducedMotion="user"` confie à Framer Motion le respect de la
 * préférence système : les animations de transformation et de mise en
 * page sont supprimées, celles d'opacité et de couleur continuent. Le
 * contenu apparaît donc toujours, simplement sans glissement.
 *
 * Pourquoi ce réglage plutôt que `useReducedMotion()` dans chaque
 * composant, comme c'était fait avant : le crochet ne peut rien savoir
 * côté SERVEUR. Il y renvoyait `false`, le HTML était donc rendu avec
 * l'état caché en ligne (`opacity:0`), puis, à l'hydratation, la
 * préférence devenait vraie, les variantes et le `whileInView`
 * disparaissaient — et plus rien ne venait lever cette opacité. Toutes
 * les sections sous le pli restaient invisibles pour toujours, soit
 * une page blanche pour qui a activé la réduction de mouvement.
 *
 * Ici, serveur et client prennent la même décision, et c'est Framer
 * qui arbitre au moment de jouer l'animation.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
