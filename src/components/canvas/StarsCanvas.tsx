"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import type { Points as ThreePoints } from "three";

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32).
 *
 * `Math.random` est proscrit pendant le rendu — la règle `react-hooks/purity`
 * le signale, et à juste titre : un re-rendu redistribuerait les étoiles, et
 * le rendu serveur ne coïnciderait pas avec le rendu client. Une graine fixe
 * donne un ciel stable et reproductible.
 */
function prng(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Champ d'étoiles en rotation lente — le fond du modèle.
 *
 * Le modèle tire ses points de `maath/random.inSphere`. On obtient ici la
 * même distribution sans dépendance supplémentaire, par rejet : on tire dans
 * le cube [-1,1]³ et on ne garde que les points tombés dans la sphère. Tirer
 * naïvement en coordonnées sphériques concentrerait les étoiles au centre.
 */
function StarField({ count = 1800, radius = 1.2 }: { count?: number; radius?: number }) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const alea = prng(20260813);
    const arr = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
      const x = alea() * 2 - 1;
      const y = alea() * 2 - 1;
      const z = alea() * 2 - 1;
      if (x * x + y * y + z * z > 1) continue; // hors de la sphère : on rejette
      arr[i * 3] = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
      i++;
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#d4af37"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

/**
 * Se place en fond du bloc parent, qui doit être `relative`.
 *
 * Comme dans le modèle, le champ d'étoiles n'habille que le dernier bloc de
 * la page (témoignages → contact) et non toute la page : un canvas WebGL
 * fixe et permanent coûterait cher en batterie sur mobile pour un décor.
 * `pointer-events-none` garantit qu'il n'intercepte jamais un clic.
 */
export function StarsCanvas() {
  // Le canvas WebGL n'a aucun sens côté serveur : on attend le montage plutôt
  // que d'imposer un `dynamic(ssr:false)` à chaque appelant — ce qui serait
  // d'ailleurs interdit depuis un composant serveur.
  const [monte, setMonte] = useState(false);
  // Drapeau de montage : setState volontaire, même convention que la navbar.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMonte(true), []);
  if (!monte) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
