"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Envoie une visite anonyme à /api/track au montage et à chaque
 * changement de route. Respecte Do Not Track.
 */
export function useVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    // Ne pas tracker l'espace admin.
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      /* tracking best-effort */
    });

    return () => controller.abort();
  }, [pathname]);
}
