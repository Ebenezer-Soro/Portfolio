import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Échelle or, dérivée du logo (#D4AF37 au centre).
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          50: "#fdfaf0",
          100: "#fbf6e4",
          200: "#f4e9bf",
          300: "#e9d68a",
          400: "rgb(var(--c-primary-400) / <alpha-value>)",
          500: "#d4af37",
          600: "#b8912b",
          700: "#8a6d1f",
          800: "#6b5417",
          900: "#453610",
        },
        accent: { DEFAULT: "rgb(var(--c-accent) / <alpha-value>)", hover: "#dcc25e" },
        accent2: { DEFAULT: "rgb(var(--c-accent2) / <alpha-value>)" },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        // ── Noirs du logo ────────────────────────────────────
        // Réutilisables tels quels quand une surface doit rester sombre
        // dans les deux thèmes (hero, fond étoilé, cartes de la scène).
        space: {
          950: "#0d0d0d",
          900: "#121212",
          850: "#161616",
          800: "#1a1a1a",
          750: "#1f1f1f", // carte de timeline
          700: "#2a2a2a", // bordure
        },
        // Neutres chauds : un blanc pur jurerait à côté de l'or.
        lavender: {
          100: "#f7f3e8",
          300: "#ded7c4", // sous-titre du hero
          400: "#a8a296", // texte courant
        },
        // Éclat et argenté du monogramme.
        eclat: "#e5e555",
        argent: { 300: "#f0f0f0", 400: "#d0d0d0", 500: "#a8a8ac" },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Poppins", "Space Grotesk", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      // Le modèle cible un palier intermédiaire à 450px (cartes de service).
      screens: {
        xs: "450px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "fade-in-down": "fadeInDown 0.6s ease-out both",
        "fade-in-left": "fadeInLeft 0.6s ease-out both",
        "scale-in": "scaleIn 0.4s ease-out both",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        gradient: "gradientShift 4s ease infinite",
        shimmer: "shimmer 1.4s ease infinite",
        "float-slow": "float 6s ease-in-out infinite",
        blob: "blobMorph 14s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          from: { opacity: "0", transform: "translateY(-24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          from: { opacity: "0", transform: "translateX(-32px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(212,175,55,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212,175,55,0.55)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          from: { backgroundPosition: "-400px 0" },
          to: { backgroundPosition: "400px 0" },
        },
        blobMorph: {
          "0%,100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "33%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "66%": { borderRadius: "50% 50% 40% 60% / 40% 50% 60% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
