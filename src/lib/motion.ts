/**
 * Variantes d'animation portées du modèle « 3D Developer Portfolio ».
 *
 * Le rythme du modèle repose sur un conteneur qui échelonne ses enfants
 * (`staggerContainer`) : le titre tombe du haut (`textVariant`), puis les
 * cartes arrivent une à une avec un délai indexé (`fadeIn(dir, …, i * 0.3)`).
 * C'est cette cascade, plus que les couleurs, qui donne sa signature au modèle.
 */
import type { Transition, Variants } from "framer-motion";

type Direction = "left" | "right" | "up" | "down" | "";
type MotionType = Transition["type"] | "";

export const textVariant = (delay = 0): Variants => ({
  hidden: { y: -50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 1.25, delay },
  },
});

export const fadeIn = (
  direction: Direction = "",
  type: MotionType = "tween",
  delay = 0,
  duration = 0.75,
): Variants => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type: (type || "tween") as Transition["type"], delay, duration, ease: "easeOut" },
  },
});

export const zoomIn = (delay = 0, duration = 0.75): Variants => ({
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "tween", delay, duration, ease: "easeOut" },
  },
});

export const slideIn = (
  direction: Direction = "left",
  type: MotionType = "tween",
  delay = 0,
  duration = 0.75,
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type: (type || "tween") as Transition["type"], delay, duration, ease: "easeOut" },
  },
});

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
