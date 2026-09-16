"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** Une compétence telle qu'affichée ici : on n'a besoin que du nom et du logo. */
export type BallItem = { id: string; name: string; iconUrl?: string | null };

const CELL = 2.6; // pas de la grille, en unités monde
const CELL_PX = 104; // taille visée d'une cellule, en pixels
const TEXTURE_PX = 256; // résolution des décalques

function BallMesh({
  texture,
  position,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
}) {
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[0, 0, 0.05]} />
        <mesh castShadow receiveShadow scale={1}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#f7f3e8"
            polygonOffset
            polygonOffsetFactor={-5}
            flatShading
          />
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={texture}
          />
        </mesh>
      </group>
    </Float>
  );
}

/** Texture carrée peinte dans un canvas 2D. */
function creerTexture(dessiner: (ctx: CanvasRenderingContext2D, taille: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEXTURE_PX;
  const ctx = canvas.getContext("2d");
  // Fond transparent : un décalque projette tout son carré sur la sphère.
  // Avec un fond opaque, on verrait une vignette plaquée sur la bille.
  if (ctx) dessiner(ctx, TEXTURE_PX);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Bille portant le logo de la technologie.
 *
 * Le logo est redessiné dans un carré, centré, avec une marge : le décalque
 * est carré, si bien qu'un logotype large (« Next.js », « PostgreSQL »)
 * serait sinon étiré, et un logo collé aux bords rogné par la courbure.
 */
function LogoBall({ url, position }: { url: string; position: [number, number, number] }) {
  const source = useTexture(url);
  const texture = useMemo(
    () =>
      creerTexture((ctx, taille) => {
      const image = source.image as HTMLImageElement | ImageBitmap | undefined;
      if (!image) return;
      const w = ("naturalWidth" in image && image.naturalWidth) || image.width;
      const h = ("naturalHeight" in image && image.naturalHeight) || image.height;
      if (!w || !h) return;
      const zone = taille * 0.7;
      const echelle = Math.min(zone / w, zone / h);
      const dw = w * echelle;
      const dh = h * echelle;
      ctx.drawImage(image, (taille - dw) / 2, (taille - dh) / 2, dw, dh);
      }),
    [source],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  return <BallMesh texture={texture} position={position} />;
}

/**
 * Bille de repli : initiales peintes dans un canvas. Elle sert quand aucune
 * compétence n'a de logo, pendant le chargement d'un logo, et si ce logo est
 * introuvable.
 */
function InitialBall({ label, position }: { label: string; position: [number, number, number] }) {
  const texture = useMemo(
    () =>
      creerTexture((ctx, taille) => {
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "900 132px Poppins, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label.slice(0, 2).toUpperCase(), taille / 2, taille / 2 + 8);
      }),
    [label],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  return <BallMesh texture={texture} position={position} />;
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

  // Sans cette trace, un logo absent passait inaperçu : la bille montrait
  // simplement les initiales, sans rien signaler.
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
          {items.map((item, i) => {
            const col = i % colonnes;
            const row = Math.floor(i / colonnes);
            const position: [number, number, number] = [
              (col - (colonnes - 1) / 2) * CELL,
              -(row - (lignes - 1) / 2) * CELL,
              0,
            ];
            const initiales = <InitialBall label={item.name} position={position} />;
            if (!item.iconUrl) return <group key={item.id}>{initiales}</group>;
            // Chaque bille a son propre Suspense : un logo lent à venir
            // n'empêche plus les autres de s'afficher.
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
