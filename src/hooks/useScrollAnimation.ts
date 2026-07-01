"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Révèle un élément quand il entre dans le viewport.
 * Ajoute la classe `is-visible` (cf. globals.css [data-animate]).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
