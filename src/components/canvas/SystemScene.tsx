"use client";

import { useEffect, useRef } from "react";

/**
 * Illustration de l'accueil — « ce que je construis ».
 *
 * Elle doit DIRE quelque chose, pas seulement décorer :
 *  - au centre, une fenêtre d'application reconnaissable (barre de
 *    titre, menu latéral, cartes, graphique, lignes de texte), légendée ;
 *  - autour, quatre modules nommés — génie logiciel, données & IA,
 *    sécurité, infrastructure — reliés à la fenêtre ;
 *  - le long de chaque liaison, une impulsion circule vers la fenêtre.
 *
 * Deux choix décisifs :
 *  - la scène OSCILLE (±20°) au lieu de tourner. Une rotation complète
 *    retourne la fenêtre et rend le dessin illisible une seconde sur
 *    deux — or il doit se lire à tout instant ;
 *  - les libellés sont écrits DANS le canvas, et redessinés quand le
 *    thème change. Un dessin sans mots retombe dans l'abstraction.
 *
 * Pourquoi un canvas 2D plutôt que React Three Fiber, utilisé ailleurs
 * dans ce projet : il ne s'agit que d'une projection filaire. Un moteur
 * WebGL coûterait un contexte graphique et un bundle supplémentaires
 * pour tracer des segments, sur la section la plus critique pour le
 * temps d'affichage.
 */

type Module = {
  libelle: string;
  x: number;
  y: number;
  z: number;
  ancre: [number, number];
  glyphe: "code" | "base" | "bouclier" | "serveur";
};

/** `x`/`y` placent le module autour de la fenêtre, `z` le rapproche ou
 *  l'éloigne — c'est cette profondeur qui donne le relief. `ancre` est
 *  le point de la fenêtre auquel il se raccorde. */
const MODULES: Module[] = [
  { libelle: "GÉNIE LOGICIEL", x: -1.44, y: 0.74, z: 0.34, ancre: [-0.78, 0.46], glyphe: "code" },
  { libelle: "DONNÉES & IA", x: 1.44, y: 0.74, z: -0.3, ancre: [0.78, 0.44], glyphe: "base" },
  { libelle: "SÉCURITÉ", x: 1.42, y: -0.72, z: 0.34, ancre: [0.74, -0.44], glyphe: "bouclier" },
  { libelle: "INFRASTRUCTURE", x: -1.42, y: -0.72, z: -0.3, ancre: [-0.74, -0.46], glyphe: "serveur" },
];

const LEGENDE = "APPLICATION WEB FULL STACK";
/** La fenêtre, en coordonnées de scène, dans le plan z = 0. */
const FEN = { x0: -0.92, x1: 0.92, y0: -0.6, y1: 0.6 };

export function SystemScene() {
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
    let echelle = 1;
    let angle = 0;
    let inclinaison = 0;
    let raf = 0;
    const pointeur = { x: 0, y: 0 };
    const visee = { x: 0, y: 0 };
    let teinte = { accent: "79 147 255", trame: "79 147 255", texte: "174 187 206", force: 1 };
    /* `ctx.font` n'accepte pas de variable CSS : il faut lui donner un
       vrai nom de famille. `next/font` en génère un, haché, qu'on lit
       sur la racine — sans quoi le canvas retomberait sur la police
       monospace du système et les libellés jureraient avec le reste. */
    let familleMono = "ui-monospace, monospace";

    const lireTeintes = () => {
      const s = getComputedStyle(racine);
      const accent = s.getPropertyValue("--c-primary").trim() || "79 147 255";
      const mono = s.getPropertyValue("--font-jetbrains-mono").trim();
      familleMono = mono ? `${mono}, ui-monospace, monospace` : "ui-monospace, monospace";
      const sombre = (racine.getAttribute("data-theme") ?? "") === "dark";
      teinte = {
        accent,
        // En jour, les traits secondaires passent au gris : du bleu
        // partout saturerait une page blanche.
        trame: sombre ? accent : "92 106 126",
        texte: sombre ? "174 187 206" : "92 106 126",
        force: sombre ? 1 : 0.9,
      };
    };
    lireTeintes();

    const redimensionner = () => {
      const nl = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      if (nl === l && nh === h) return; // rien n'a bougé
      l = nl;
      h = nh;
      canvas.width = Math.round(l * densite);
      canvas.height = Math.round(h * densite);
      // Toutes les coordonnées restent exprimées en pixels CSS.
      ctx.setTransform(densite, 0, 0, densite, 0, 0);
      echelle = Math.min(l, h) * 0.245;
      if (reduit) dessiner(0);
    };

    /** Projection : rotation autour de Y, bascule, puis perspective. */
    const P = (x: number, y: number, z = 0) => {
      const sa = Math.sin(angle);
      const ca = Math.cos(angle);
      const rx = x * ca - z * sa;
      const rz = x * sa + z * ca;
      const si = Math.sin(inclinaison);
      const ci = Math.cos(inclinaison);
      const ry = y * ci - rz * si;
      const rzz = y * si + rz * ci;
      const f = 7 / (7 - rzz); // distance focale
      return { x: l / 2 + rx * echelle * f, y: h / 2 - ry * echelle * f };
    };

    const couleur = (canaux: string, alpha: number) => `rgb(${canaux} / ${alpha.toFixed(3)})`;

    const quad = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      z: number,
      trait: string | null,
      remplissage: string | null,
      epaisseur = 1,
    ) => {
      const pts = [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      if (remplissage) {
        ctx.fillStyle = remplissage;
        ctx.fill();
      }
      if (trait) {
        ctx.strokeStyle = trait;
        ctx.lineWidth = epaisseur;
        ctx.stroke();
      }
    };

    const segment = (
      a: { x: number; y: number },
      b: { x: number; y: number },
      trait: string,
      epaisseur = 1,
    ) => {
      ctx.strokeStyle = trait;
      ctx.lineWidth = epaisseur;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const polyligne = (pts: { x: number; y: number }[], fermer: boolean) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (fermer) ctx.closePath();
      ctx.stroke();
    };

    /** Les proportions sont celles d'une vraie interface : c'est cette
     *  ressemblance qui fait passer le message. */
    const dessinerFenetre = (F: number) => {
      const acc = teinte.accent;
      const tr = teinte.trame;

      quad(FEN.x0, FEN.y0, FEN.x1, FEN.y1, 0, couleur(acc, 0.55 * F), couleur(acc, 0.05 * F), 1.6);

      const yBarre = FEN.y1 - 0.13;
      quad(FEN.x0, yBarre, FEN.x1, FEN.y1, 0, couleur(acc, 0.35 * F), couleur(acc, 0.07 * F));
      for (let d = 0; d < 3; d++) {
        const pt = P(FEN.x0 + 0.08 + d * 0.075, FEN.y1 - 0.065, 0);
        ctx.fillStyle = couleur(acc, 0.5 * F);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1.6, echelle * 0.014), 0, Math.PI * 2);
        ctx.fill();
      }
      quad(FEN.x0 + 0.34, yBarre + 0.035, FEN.x1 - 0.1, FEN.y1 - 0.035, 0, null, couleur(acc, 0.14 * F));

      const xMenu = FEN.x0 + 0.34;
      segment(P(xMenu, FEN.y0, 0), P(xMenu, yBarre, 0), couleur(acc, 0.3 * F));
      for (let m = 0; m < 4; m++) {
        const yl = yBarre - 0.13 - m * 0.11;
        quad(FEN.x0 + 0.07, yl - 0.035, xMenu - 0.08, yl + 0.025, 0, null,
          couleur(acc, (m === 0 ? 0.3 : 0.13) * F));
      }

      quad(xMenu + 0.08, yBarre - 0.3, xMenu + 0.58, yBarre - 0.04, 0,
        couleur(acc, 0.28 * F), couleur(acc, 0.07 * F));
      quad(xMenu + 0.66, yBarre - 0.3, FEN.x1 - 0.08, yBarre - 0.04, 0,
        couleur(acc, 0.28 * F), couleur(acc, 0.07 * F));
      quad(xMenu + 0.14, yBarre - 0.16, xMenu + 0.34, yBarre - 0.1, 0, null, couleur(acc, 0.32 * F));
      quad(xMenu + 0.72, yBarre - 0.16, xMenu + 0.92, yBarre - 0.1, 0, null, couleur(acc, 0.32 * F));

      // Un graphique en barres : le signe le plus reconnaissable d'un
      // tableau de bord.
      const hauteurs = [0.1, 0.19, 0.13, 0.26, 0.17];
      const xBase = xMenu + 0.1;
      const yBase = FEN.y0 + 0.08;
      segment(P(xBase - 0.03, yBase, 0), P(FEN.x1 - 0.08, yBase, 0), couleur(tr, 0.22 * F));
      hauteurs.forEach((hb, b) => {
        const xb = xBase + b * 0.1;
        quad(xb, yBase, xb + 0.06, yBase + hb, 0, null, couleur(acc, (0.3 + b * 0.07) * F));
      });
      for (let t = 0; t < 3; t++) {
        const yt = yBase + 0.3 - t * 0.08;
        quad(xMenu + 0.74, yt, FEN.x1 - 0.08 - (t === 2 ? 0.14 : 0), yt + 0.035, 0, null,
          couleur(tr, 0.2 * F));
      }
    };

    const glyphe = (nom: Module["glyphe"], cx: number, cy: number, cz: number, r: number, F: number) => {
      const acc = couleur(teinte.accent, 0.85 * F);
      const pt = (ux: number, uy: number) => P(cx + ux * r, cy + uy * r, cz);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = acc;

      if (nom === "code") {
        polyligne([pt(-0.15, 0.55), pt(-0.75, 0), pt(-0.15, -0.55)], false);
        polyligne([pt(0.15, 0.55), pt(0.75, 0), pt(0.15, -0.55)], false);
      } else if (nom === "base") {
        // Cylindre : deux ellipses approximées par des polygones. Un
        // disque projeté n'est plus un cercle.
        for (let k = 0; k < 2; k++) {
          const yk = 0.45 - k * 0.9;
          const anneau = [];
          for (let a = 0; a <= 16; a++) {
            const th = (a / 16) * Math.PI * 2;
            anneau.push(pt(Math.cos(th) * 0.62, yk + Math.sin(th) * 0.2));
          }
          polyligne(anneau, true);
        }
        segment(pt(-0.62, 0.45), pt(-0.62, -0.45), acc, 1.4);
        segment(pt(0.62, 0.45), pt(0.62, -0.45), acc, 1.4);
      } else if (nom === "bouclier") {
        polyligne([pt(0, 0.72), pt(0.6, 0.38), pt(0.6, -0.18), pt(0, -0.72), pt(-0.6, -0.18), pt(-0.6, 0.38)], true);
        polyligne([pt(-0.26, 0.04), pt(-0.06, -0.2), pt(0.3, 0.3)], false);
      } else {
        for (let s = 0; s < 3; s++) {
          const ys = 0.46 - s * 0.46;
          polyligne([pt(-0.66, ys), pt(0.66, ys), pt(0.66, ys - 0.3), pt(-0.66, ys - 0.3)], true);
          const voyant = pt(-0.46, ys - 0.15);
          ctx.fillStyle = acc;
          ctx.beginPath();
          ctx.arc(voyant.x, voyant.y, Math.max(1.2, echelle * 0.011), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const dessinerModule = (mod: Module, F: number) => {
      const demiL = 0.3;
      const demiH = 0.26;
      quad(mod.x - demiL, mod.y - demiH, mod.x + demiL, mod.y + demiH, mod.z,
        couleur(teinte.accent, 0.45 * F), couleur(teinte.accent, 0.08 * F), 1.3);
      glyphe(mod.glyphe, mod.x, mod.y + 0.02, mod.z, 0.17, F);

      // Libellé AU-DESSUS pour les modules du haut, en dessous pour
      // ceux du bas : tous en dessous, celui de droite passait derrière
      // une carte de chiffres.
      const cote = mod.y > 0 ? 1 : -1;
      const ancre = P(mod.x, mod.y + cote * (demiH + 0.13), mod.z);
      const corps = Math.max(8, Math.round(echelle * 0.058));
      ctx.font = `500 ${corps}px ${familleMono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = couleur(teinte.texte, 0.95);
      ctx.fillText(mod.libelle, ancre.x, ancre.y);
    };

    function dessiner(t: number) {
      // Oscillation plutôt que rotation : la fenêtre ne doit jamais
      // tourner le dos au visiteur.
      const base = reduit ? 0.22 : Math.sin(t / 4200) * 0.34;
      visee.x += (pointeur.x - visee.x) * 0.055;
      visee.y += (pointeur.y - visee.y) * 0.055;
      angle = base + visee.x * 0.22;
      inclinaison = 0.13 + visee.y * 0.08 + (reduit ? 0 : Math.sin(t / 6100) * 0.05);

      const F = teinte.force;
      ctx!.clearRect(0, 0, l, h);

      // Sol : une grille très pâle, loin derrière, qui pose la scène.
      const yd = FEN.y0 - 0.95;
      for (let g = -3; g <= 3; g++) {
        const u = g / 2.4;
        segment(P(u, yd, -1.1), P(u, yd, 1.1), couleur(teinte.trame, 0.07 * F));
        segment(P(-1.25, yd, u), P(1.25, yd, u), couleur(teinte.trame, 0.07 * F));
      }

      // Liaisons module → fenêtre, en premier : elles passent dessous.
      MODULES.forEach((mod) => {
        segment(P(mod.x, mod.y, mod.z), P(mod.ancre[0], mod.ancre[1], 0), couleur(teinte.accent, 0.3 * F));
      });

      dessinerFenetre(F);
      MODULES.forEach((mod) => dessinerModule(mod, F));

      const sous = P(0, FEN.y0 - 0.26, 0);
      const corps = Math.max(9, Math.round(echelle * 0.062));
      ctx!.font = `500 ${corps}px ${familleMono}`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = couleur(teinte.accent, 0.95);
      ctx!.fillText(LEGENDE, sous.x, sous.y);

      if (!reduit) {
        MODULES.forEach((mod, i) => {
          const avance = (t / 3400 + i / MODULES.length) % 1;
          const a = P(mod.x, mod.y, mod.z);
          const b = P(mod.ancre[0], mod.ancre[1], 0);
          const x = a.x + (b.x - a.x) * avance;
          const y = a.y + (b.y - a.y) * avance;
          const halo = ctx!.createRadialGradient(x, y, 0, x, y, 10);
          halo.addColorStop(0, couleur(teinte.accent, 0.9));
          halo.addColorStop(1, couleur(teinte.accent, 0));
          ctx!.fillStyle = halo;
          ctx!.beginPath();
          ctx!.arc(x, y, 10, 0, Math.PI * 2);
          ctx!.fill();
        });
        raf = requestAnimationFrame(dessiner);
      }
    }

    redimensionner();
    if (!reduit) raf = requestAnimationFrame(dessiner);
    else dessiner(0);

    // La boîte n'a sa taille définitive qu'une fois les polices
    // chargées et la mise en page stabilisée : on la suit au lieu de la
    // mesurer une seule fois. Le redessin après `fonts.ready` compte
    // double ici : les libellés sont en monospace.
    const ro = new ResizeObserver(redimensionner);
    ro.observe(canvas);
    document.fonts?.ready.then(() => {
      redimensionner();
      if (reduit) dessiner(0);
    });

    // Le thème peut changer à tout moment : les couleurs sont lues sur
    // lui, il faut donc les relire et redessiner.
    const mo = new MutationObserver(() => {
      lireTeintes();
      if (reduit) dessiner(0);
    });
    mo.observe(racine, { attributes: true, attributeFilter: ["data-theme", "class"] });

    const surPointeur = (e: PointerEvent) => {
      pointeur.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointeur.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduit) window.addEventListener("pointermove", surPointeur, { passive: true });
    window.addEventListener("resize", redimensionner);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", surPointeur);
      window.removeEventListener("resize", redimensionner);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}
