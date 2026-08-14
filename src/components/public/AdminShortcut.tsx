"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Accès clavier à l'administration — Ctrl + Alt + E.
 *
 * Le site public ne contient plus aucun lien vers /admin : un visiteur ne peut
 * pas le découvrir en lisant le HTML. Ce composant n'affiche rien et n'ajoute
 * aucun attribut au DOM ; il ne fait qu'écouter le clavier.
 *
 * Précaution AZERTY : sous Windows, AltGr est signalé comme Ctrl + Alt. Sur un
 * clavier français, AltGr + E produit « € » — la combinaison demandée entrerait
 * donc en collision avec une frappe légitime. Le raccourci est pour cette raison
 * ignoré dès que la saisie a lieu dans un champ de texte.
 *
 * Ce n'est pas une mesure de sécurité : la protection réelle reste
 * l'authentification. C'est de la discrétion, qui réduit la surface d'attaque
 * opportuniste en n'exposant pas la porte.
 */
export function AdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    const saisieEnCours = (cible: EventTarget | null) => {
      const el = cible as HTMLElement | null;
      if (!el) return false;
      const balise = el.tagName;
      return (
        balise === "INPUT" ||
        balise === "TEXTAREA" ||
        balise === "SELECT" ||
        el.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // `code` plutôt que `key` : la touche physique reste « KeyE » quelle que
      // soit la disposition du clavier, alors que `key` vaudrait « € » ou « e »
      // selon la carte de caractères active.
      if (e.code !== "KeyE" || !e.ctrlKey || !e.altKey || e.shiftKey || e.metaKey) return;
      if (saisieEnCours(e.target)) return;

      e.preventDefault();
      router.push("/admin/login");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
