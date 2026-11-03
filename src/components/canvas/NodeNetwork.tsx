"use client";

import { useEffect, useRef } from "react";

/**
 * Réseau de nœuds — fond de la section contact.
 *
 * Le même vocabulaire que l'illustration de l'accueil, très atténué :
 * des points qui dérivent, reliés dès qu'ils s'approchent. Les
 * couleurs sont lues sur le thème actif, pas codées en dur, et le
 * canvas se redessine au basculement.
 *
 * Il remplace le champ d'étoiles en WebGL de la version précédente :
 * même rôle décoratif, sans contexte 3D ni dépendance — et il s'adapte
 * au thème clair, ce que des étoiles dorées sur fond noir ne savaient
 * pas faire.
 */
export function NodeNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const racine = document.documentElement;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const densite = Math.min(window.devicePixelRatio || 1, 2);

    let l = 0;
    let h = 0;
    let raf = 0;
    let accent = "79 147 255";
    let alphaMax = 0.22;
    let noeuds: { x: number; y: number; vx: number; vy: number }[] = [];

    const lireTeinte = () => {
      accent = getComputedStyle(racine).getPropertyValue("--c-primary").trim() || accent;
      // En jour, le réseau doit rester un filigrane : la page est
      // blanche, le moindre trait bleu s'y voit beaucoup plus.
      alphaMax = (racine.getAttribute("data-theme") ?? "") === "dark" ? 0.22 : 0.13;
    };
    lireTeinte();

    const semer = () => {
      // Densité proportionnelle à la surface, plafonnée : sur un grand
      // écran, un nombre fixe donnerait un fond vide.
      const nombre = Math.min(72, Math.max(18, Math.round((l * h) / 19000)));
      noeuds = Array.from({ length: nombre }, () => ({
        x: Math.random() * l,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
      }));
    };

    const redimensionner = () => {
      const nl = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      if (nl === l && nh === h) return; // rien n'a bougé
      l = nl;
      h = nh;
      canvas.width = Math.round(l * densite);
      canvas.height = Math.round(h * densite);
      ctx.setTransform(densite, 0, 0, densite, 0, 0);
      semer();
      if (reduit) dessiner();
    };

    function dessiner() {
      ctx!.clearRect(0, 0, l, h);
      for (let i = 0; i < noeuds.length; i++) {
        const n = noeuds[i];
        if (!reduit) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > l) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        ctx!.fillStyle = `rgb(${accent} / ${(alphaMax * 1.6).toFixed(3)})`;
        ctx!.fillRect(n.x - 1, n.y - 1, 2, 2);
        for (let j = i + 1; j < noeuds.length; j++) {
          const m = noeuds[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d > 210) continue;
          ctx!.strokeStyle = `rgb(${accent} / ${(alphaMax * (1 - d / 210)).toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(n.x, n.y);
          ctx!.lineTo(m.x, m.y);
          ctx!.stroke();
        }
      }
      if (!reduit) raf = requestAnimationFrame(dessiner);
    }

    redimensionner();
    if (!reduit) raf = requestAnimationFrame(dessiner);
    else dessiner();

    const ro = new ResizeObserver(redimensionner);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      lireTeinte();
      if (reduit) dessiner();
    });
    mo.observe(racine, { attributes: true, attributeFilter: ["data-theme", "class"] });
    window.addEventListener("resize", redimensionner);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", redimensionner);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
