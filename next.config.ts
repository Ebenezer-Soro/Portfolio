import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les médias du CMS sont servis localement depuis /public/uploads (chemins
    // relatifs) : aucun remotePattern n'est nécessaire pour eux. N'ajoute ici que
    // les domaines externes réellement utilisés (évite le proxy d'images ouvert).
    remotePatterns: [
      // Exemple : { protocol: "https", hostname: "images.exemple.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
