import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Instance edge-safe (sans Prisma) pour la protection des routes.
const { auth } = NextAuth(authConfig);

const enDev = process.env.NODE_ENV === "development";

/**
 * Génère un nonce par requête.
 *
 * `Buffer` n'existe pas dans le runtime edge : on passe par l'API Web Crypto
 * et btoa.
 */
function genererNonce(): string {
  const octets = new Uint8Array(16);
  crypto.getRandomValues(octets);
  return btoa(String.fromCharCode(...octets));
}

/**
 * Politique de sécurité du contenu, durcie par nonce.
 *
 * `script-src` n'accepte plus `'unsafe-inline'` : seuls les scripts portant le
 * nonce de la requête s'exécutent. `'strict-dynamic'` autorise ces scripts à en
 * charger d'autres (Next.js charge ses fragments dynamiquement), tout en
 * neutralisant les listes d'hôtes — un domaine autorisé ne suffit plus, il faut
 * une chaîne de confiance depuis un script nonce.
 *
 * `style-src` conserve `'unsafe-inline'` : c'est incontournable. Framer Motion
 * anime en écrivant dans l'attribut `style`, et Next.js injecte ses feuilles en
 * ligne. Le risque est sans commune mesure avec celui des scripts : une
 * injection de style ne s'exécute pas.
 */
function construireCsp(nonce: string): string {
  return [
    "default-src 'self'",
    // 'unsafe-eval' uniquement en développement : Turbopack en a besoin pour
    // le rafraîchissement à chaud. En production ce serait un vecteur direct.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${enDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
    `connect-src 'self'${enDev ? " ws: wss:" : ""}`,
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export default auth((req) => {
  const nonce = genererNonce();
  const csp = construireCsp(nonce);

  // Le nonce est transmis au rendu par un en-tête de requête : le layout le
  // relit pour en équiper les scripts qu'il pose lui-même (thème, JSON-LD).
  const enTetes = new Headers(req.headers);
  enTetes.set("x-nonce", nonce);

  const chemin = req.nextUrl.pathname;

  /*
   * Les routes Next sont sensibles à la casse : « /Admin/Login » renvoie 404.
   * Or l'administration est la seule URL que l'on saisit à la main, et les
   * claviers mobiles imposent une majuscule au premier mot de la barre
   * d'adresse. On normalise donc vers la forme canonique en minuscules avant
   * toute autre décision.
   */
  const cheminMinuscule = chemin.toLowerCase();
  if (cheminMinuscule.startsWith("/admin") && chemin !== cheminMinuscule) {
    const url = req.nextUrl.clone();
    url.pathname = cheminMinuscule;
    const redirection = NextResponse.redirect(url);
    redirection.headers.set("Content-Security-Policy", csp);
    return redirection;
  }

  const routeAdmin = chemin.startsWith("/admin");
  const pageLogin = chemin === "/admin/login";
  const connecte = Boolean(req.auth);

  let reponse: NextResponse;

  if (pageLogin && connecte) {
    reponse = NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  } else if (routeAdmin && !pageLogin && !connecte) {
    reponse = NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  } else {
    reponse = NextResponse.next({ request: { headers: enTetes } });
  }

  // Next.js lit le nonce directement dans cet en-tête pour en équiper ses
  // propres balises <script>. Il doit donc être posé sur toutes les réponses.
  reponse.headers.set("Content-Security-Policy", csp);
  return reponse;
});

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf les ressources déjà figées, pour lesquelles un
     * nonce n'a pas de sens et qui n'ont pas à payer le coût du middleware :
     * fragments Next, optimiseur d'images, fichiers statiques.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
