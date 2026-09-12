import type { NextConfig } from "next";

const enDev = process.env.NODE_ENV === "development";

/*
 * La Content-Security-Policy n'est PAS définie ici : elle porte un nonce
 * régénéré à chaque requête, ce qu'un en-tête statique ne peut pas faire.
 * Elle est posée par le middleware (src/middleware.ts).
 */
const entetesSecurite = [
  // Empêche l'inclusion du site dans une iframe tierce (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Interdit au navigateur de deviner un type MIME différent de celui déclaré.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Coupe l'accès aux capteurs et périphériques, dont ce site n'a aucun usage.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Masque la version du framework dans les réponses : une information de
  // moins pour cibler une faille connue.
  poweredByHeader: false,

  /* `sharp` est un module natif : il doit rester hors du paquet compilé et
     être chargé depuis node_modules à l'exécution. Next l'externalise déjà
     par défaut ; le déclarer ici rend la contrainte explicite et la protège
     d'un changement de valeur par défaut. */
  serverExternalPackages: ["sharp"],

  images: {
    // Les médias du CMS sont servis localement depuis /public/uploads (chemins
    // relatifs) : aucun remotePattern n'est nécessaire pour eux. N'ajoute ici que
    // les domaines externes réellement utilisés (évite le proxy d'images ouvert).
    remotePatterns: [
      // Vercel Blob : stockage des médias uploadés depuis l'admin.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Exemple domaine externe : { protocol: "https", hostname: "images.exemple.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...entetesSecurite,
          // HSTS n'a de sens qu'en HTTPS ; l'imposer en local casserait le
          // serveur de développement.
          ...(enDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
      {
        // L'administration ne doit jamais être mise en cache ni indexée.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
