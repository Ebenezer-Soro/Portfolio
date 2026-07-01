"use client";

import { useVisitTracker } from "@/hooks/useVisitTracker";

// Composant client invisible : enregistre les visites anonymes.
export function VisitTracker() {
  useVisitTracker();
  return null;
}
