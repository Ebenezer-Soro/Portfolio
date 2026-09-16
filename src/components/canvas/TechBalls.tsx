"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** Une compétence telle qu'affichée ici : on n'a besoin que du nom et du logo. */
export type BallItem = { id: string; name: string; iconUrl?: string | null };

const CELL = 2.6; // pas de la grille, en unités monde
const CELL_PX = 104; // taille visée d'une cellule, en pixels
const TEXTURE_INITIALES_PX = 256;
const TEXTURE_LOGO_PX = 512;
/** Fond des logos détourés : leurs zones transparentes laisseraient des trous. */
const FOND_LOGO = "#f7f3e8";

type Position = [number, number, number];

/** Flottement commun à toutes les billes. */
function BilleFlottante({ position, children }: { position: Position; children: ReactNode }) {
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>{children}</group>
    </Float>
  );
}

/**
 * Bille-logo : l'image du logo EST la surface de la bille.
 *
 * Elle sert de texture au matériau de la sphère, et non de décalque posé sur
 * une bille neutre. La sphère répartit sa texture sur 360° : répétée deux
 * fois en largeur, l'image occupe exactement l'hémisphère tourné vers le
 * visiteur, et une seconde copie habille la face arrière, que le flottement
 * laisse entrevoir.
 *
 * L'image est dessinée en « couverture » (comme `object-fit: cover`) pour
 * recouvrir toute la surface ; les zones transparentes d'un logo détouré sont
 * comblées par un fond clair.
 */
function LogoBall({ url, position }: { url: string; position: Position }) {
  const source = useTexture(url);

  const texture = useMemo(() => {
    const taille = TEXTURE_LOGO_PX;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = taille;
    const ctx = canvas.getContext("2d");
    const image = source.image as HTMLImageElement | ImageBitmap | undefined;
    if (ctx && image) {
      const w = ("naturalWidth" in image && image.naturalWidth) || image.width;
      const h = ("naturalHeight" in image && image.naturalHeight) || image.height;
      if (w && h) {
        const echelle = Math.max(taille / w, taille / h);
        const dw = w * echelle;
        const dh = h * echelle;
        ctx.drawImage(image, (taille - dw) / 2, (taille - dh) / 2, dw, dh);
      }
      // Peint SOUS l'image déjà dessinée : ne comble que les zones transparentes.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = FOND_LOGO;
      ctx.fillRect(0, 0, taille, taille);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    tex.anisotropy = 8;
    return tex;
  }, [source]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <BilleFlottante position={position}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.45} metalness={0.05} />
      </mesh>
    </BilleFlottante>
  );
}

/**
 * Bille de repli, tant qu'aucun logo n'est disponible : bille facettée du
 * modèle, portant les initiales en décalque. Elle sert aussi pendant le
 * chargement d'un logo et si ce logo est introuvable.
 */
function InitialBall({ label, position }: { label: string; position: Position }) {
  const texture = useMemo(() => {
    const taille = TEXTURE_INITIALES_PX;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = taille;
    const ctx = canvas.getContext("2d");
    // Fond transparent : un décalque projette tout son carré sur la sphère.
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "900 132px Poppins, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.slice(0, 2).toUpperCase(), taille / 2, taille / 2 + 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [label]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <BilleFlottante position={position}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={FOND_LOGO} polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={texture} />
      </mesh>
    </BilleFlottante>
  );
}

/**
 * Un logo qui ne se charge pas (fichier supprimé, adresse erronée) ne doit
 * pas faire disparaître la grille entière : seule sa bille retombe sur les
 * initiales.
 */
class RepliSiErreur extends Component<
  { repli: ReactNode; children: ReactNode; url: string },
  { erreur: boolean }
> {
  state = { erreur: false };

  static getDerivedStateFromError() {
    return { erreur: true };
  }

  componentDidCatch(erreur: unknown) {
    console.warn("[compétences] logo non chargé, initiales affichées :", this.props.url, erreur);
  }

  render() {
    return this.state.erreur ? this.props.repli : this.props.children;
  }
}

function colonnesPour(largeur: number) {
  if (largeur < 380) return 3;
  if (largeur < 560) return 4;
  if (largeur < 820) return 5;
  return 6;
}

/**
 * Grille de billes 3D — la section « Tech » du modèle.
 *
 * Le modèle monte un `<Canvas>` par bille. Avec un catalogue de compétences
 * alimenté par la base, cela dépasserait vite la limite de contextes WebGL du
 * navigateur (~16). Toutes les billes partagent donc ici un seul canvas, et
 * la grille est disposée en coordonnées monde. La caméra orthographique rend
 * la conversion exacte : 1 unité monde = `zoom` pixels.
 */
export function TechBalls({ items }: { items: BallItem[] }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [largeur, setLargeur] = useState(0);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setLargeur(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { colonnes, lignes, hauteur } = useMemo(() => {
    const c = colonnesPour(largeur || 1024);
    const l = Math.max(1, Math.ceil(items.length / c));
    return { colonnes: c, lignes: l, hauteur: l * CELL_PX };
  }, [largeur, items.length]);

  if (!items.length) return null;

  const zoom = CELL_PX / CELL;

  return (
    <div ref={wrapper} className="w-full" style={{ height: hauteur }}>
      {largeur > 0 && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom }}
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: true }}
        >
          {/*
            Éclairage UNIQUE pour toute la scène. Le modèle plaçait une paire
            de lumières dans chaque bille, ce qui se justifiait avec un canvas
            par bille ; ici toutes les billes partagent la scène, et ces
            lumières s'additionnaient — douze compétences, douze fois la
            lumière, de quoi délaver les couleurs des logos.
          */}
          <ambientLight intensity={0.85} />
          <directionalLight position={[2, 3, 6]} intensity={0.9} />

          {items.map((item, i) => {
            const col = i % colonnes;
            const row = Math.floor(i / colonnes);
            const position: Position = [
              (col - (colonnes - 1) / 2) * CELL,
              -(row - (lignes - 1) / 2) * CELL,
              0,
            ];
            const initiales = <InitialBall label={item.name} position={position} />;
            if (!item.iconUrl) return <group key={item.id}>{initiales}</group>;
            // Chaque bille a son propre Suspense : un logo lent à venir
            // n'empêche pas les autres de s'afficher.
            return (
              <RepliSiErreur key={`${item.id}:${item.iconUrl}`} repli={initiales} url={item.iconUrl}>
                <Suspense fallback={initiales}>
                  <LogoBall url={item.iconUrl} position={position} />
                </Suspense>
              </RepliSiErreur>
            );
          })}
          <Preload all />
        </Canvas>
      )}
    </div>
  );
}
