import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

// Image Open Graph par défaut (1200×630), générée à la volée.
// Sert d'aperçu au partage du site quand une page n'a pas d'image propre.
// Runtime edge : moteur WASM (évite l'erreur native de sharp/libvips au build).
export const runtime = "edge";
export const alt = "Soro Z. Ebenezer — Développeur Full Stack & Ingénieur Informatique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0d0d0d",
          backgroundImage:
            "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 55%, #2a220f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #d4af37, #e5e555)",
              fontSize: "40px",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, opacity: 0.95 }}>
            Soro Z. Ebenezer
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            <div>Développeur Full Stack</div>
            <div>&amp; Ingénieur Informatique</div>
          </div>
          <div style={{ fontSize: "30px", opacity: 0.8 }}>
            Développement web · Cybersécurité · Intelligence artificielle
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "28px",
            fontWeight: 600,
            color: "#dcc25e",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              background: "#d4af37",
            }}
          />
          {host}
        </div>
      </div>
    ),
    { ...size },
  );
}
