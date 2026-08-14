"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** Une compétence telle qu'affichée ici : on n'a besoin que du nom et de l'icône. */
export type BallItem = { id: string; name: string; iconUrl?: string | null };

const CELL = 2.6; // pas de la grille, en unités monde
const CELL_PX = 104; // taille visée d'une cellule, en pixels

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

/** Bille dont le décalque provient d'une image téléversée par l'admin. */
function IconBall({ url, position }: { url: string; position: [number, number, number] }) {
  const texture = useTexture(url);
  return <BallMesh texture={texture} position={position} />;
}

/**
 * Bille de repli : la texture est peinte dans un canvas 2D à partir des
 * initiales. Cela évite d'exiger une icône pour chaque compétence — le champ
 * `iconUrl` est optionnel en base — et n'ajoute aucun fichier à charger.
 */
function InitialBall({
  label,
  position,
}: {
  label: string;
  position: [number, number, number];
}) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Fond laissé transparent : un décalque projette tout son carré sur la
      // sphère. Avec un fond opaque, on verrait une vignette sombre plaquée
      // sur la bille au lieu des seules lettres.
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "900 132px Poppins, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.slice(0, 2).toUpperCase(), size / 2, size / 2 + 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [label]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <BallMesh texture={texture} position={position} />;
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
          <Suspense fallback={null}>
            {items.map((item, i) => {
              const col = i % colonnes;
              const row = Math.floor(i / colonnes);
              const position: [number, number, number] = [
                (col - (colonnes - 1) / 2) * CELL,
                -(row - (lignes - 1) / 2) * CELL,
                0,
              ];
              return item.iconUrl ? (
                <IconBall key={item.id} url={item.iconUrl} position={position} />
              ) : (
                <InitialBall key={item.id} label={item.name} position={position} />
              );
            })}
          </Suspense>
          <Preload all />
        </Canvas>
      )}
    </div>
  );
}
