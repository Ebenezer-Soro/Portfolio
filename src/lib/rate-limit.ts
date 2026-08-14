/**
 * Limitation de débit en mémoire, par adresse IP.
 *
 * Suffisant pour une instance unique (le cas de ce portfolio). En déploiement
 * multi-instance, chaque processus tiendrait son propre compteur : il faudrait
 * alors une mémoire partagée (Redis, Upstash). Le point de contrôle est
 * volontairement isolé ici pour que ce remplacement ne touche qu'un fichier.
 */

type Fenetre = { debut: number; compte: number };

const compteurs = new Map<string, Fenetre>();

// Purge périodique : sans elle, la Map croît indéfiniment avec les IP vues.
let dernierNettoyage = 0;
function nettoyer(maintenant: number, dureeMs: number) {
  if (maintenant - dernierNettoyage < 60_000) return;
  dernierNettoyage = maintenant;
  for (const [cle, f] of compteurs) {
    if (maintenant - f.debut > dureeMs * 2) compteurs.delete(cle);
  }
}

export type ResultatLimite = {
  autorise: boolean;
  restant: number;
  resetDans: number; // secondes
};

/**
 * @param cle        identifiant du seau (ex. `contact:1.2.3.4`)
 * @param maximum    nombre d'appels autorisés dans la fenêtre
 * @param dureeMs    largeur de la fenêtre glissante
 */
export function limiter(cle: string, maximum: number, dureeMs: number): ResultatLimite {
  const maintenant = Date.now();
  nettoyer(maintenant, dureeMs);

  const actuel = compteurs.get(cle);

  if (!actuel || maintenant - actuel.debut > dureeMs) {
    compteurs.set(cle, { debut: maintenant, compte: 1 });
    return { autorise: true, restant: maximum - 1, resetDans: Math.ceil(dureeMs / 1000) };
  }

  actuel.compte += 1;
  const resetDans = Math.ceil((dureeMs - (maintenant - actuel.debut)) / 1000);

  if (actuel.compte > maximum) {
    return { autorise: false, restant: 0, resetDans };
  }
  return { autorise: true, restant: maximum - actuel.compte, resetDans };
}

/** Extrait l'IP de l'appelant derrière un éventuel proxy de confiance. */
export function ipDe(req: Request): string {
  const transmis = req.headers.get("x-forwarded-for");
  if (transmis) return transmis.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "inconnue";
}
