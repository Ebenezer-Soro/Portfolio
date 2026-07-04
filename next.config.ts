import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
