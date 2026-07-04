import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Génère /robots.txt — autorise le contenu public, bloque l'admin et l'API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
