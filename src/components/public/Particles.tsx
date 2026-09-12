"use client";

import { useEffect, useRef } from "react";

/**
 * Poussière dorée flottante, derrière le hero.
 *
 * Trois points d'attention :
 *  - la densité de pixels de l'écran est prise en compte, sinon les points
 *    paraissent flous sur un écran moderne ;
 *  - chaque point scintille à son propre rythme, ce qui rend le mouvement
 *    perceptible sans l'accélérer ;
 *  - en cas de préférence pour un mouvement réduit, une image fixe est
 *    dessinée : le décor reste, l'animation disparaît.
 */
export function Particles({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const densite = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;

    const redimensionner = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * densite);
      canvas.height = Math.round(h * densite);
      // Toutes les coordonnées restent exprimées en pixels CSS.
      ctx.setTransform(densite, 0, 0, densite, 0, 0);
    };
    redimensionner();

    const alea = (min: number, max: number) => min + Math.random() * (max - min);
    const points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: alea(0.9, 2.6),
      vx: alea(-0.22, 0.22),
      vy: alea(-0.22, 0.22),
      opacite: alea(0.3, 0.85),
      // Scintillement : chaque point démarre à un endroit différent de son
      // cycle, sans quoi tous clignoteraient ensemble.
      phase: Math.random() * Math.PI * 2,
      vitesse: alea(0.4, 1.1),
      // Quelques points prennent le jaune éclat du logo, les autres l'or.
      eclat: Math.random() < 0.25,
    }));

    const dessiner = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        if (!reduit) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        const scintillement = reduit ? 1 : 0.7 + 0.3 * Math.sin(t / 1000 * p.vitesse + p.phase);
        const couleur = p.eclat ? "229, 229, 85" : "212, 175, 55";
        // Halo : c'est lui qui rend la poussière perceptible sur le fond noir.
        ctx.shadowBlur = p.r * 4;
        ctx.shadowColor = `rgba(${couleur}, ${p.opacite * scintillement * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${couleur}, ${p.opacite * scintillement})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduit) raf = requestAnimationFrame(dessiner);
    };
    dessiner(0);

    window.addEventListener("resize", redimensionner);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", redimensionner);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
