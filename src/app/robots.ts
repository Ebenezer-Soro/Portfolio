import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Génère /robots.txt — autorise le contenu public, bloque l'API.
//
// L'admin n'y figure VOLONTAIREMENT pas : robots.txt est public, et y
// écrire « Disallow: /admin » revenait à indiquer l'adresse du back-office
// à quiconque le lit. L'admin n'est lié nulle part ; s'il était découvert,
// il reste exclu de l'indexation par la balise meta robots de son layout et
// par l'en-tête X-Robots-Tag posé dans le middleware.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
