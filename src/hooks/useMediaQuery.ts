"use client";

import { useEffect, useState } from "react";

/** Retourne true si la media query correspond. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Synchronisation avec un système externe (matchMedia) : usage volontaire.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
