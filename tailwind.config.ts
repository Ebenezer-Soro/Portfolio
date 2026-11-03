import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Échelle du bleu électrique. `DEFAULT` et `400` passent par les
        // canaux RVB : ils changent de valeur d'un thème à l'autre, et
        // un conteneur peut les surcharger (voir `.admin-scope`).
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          50: "#f2f7ff",
          100: "#e8f0ff",
          200: "#c9ddff",
          300: "#9cc0ff",
          400: "rgb(var(--c-primary-400) / <alpha-value>)",
          500: "#2e7dff",
          600: "#1554d6",
          700: "#0f3fa6",
          800: "#0b2d75",
          900: "#081f52",
        },
        accent: { DEFAULT: "rgb(var(--c-accent) / <alpha-value>)", hover: "#4f93ff" },
        accent2: { DEFAULT: "rgb(var(--c-accent2) / <alpha-value>)" },
        success: "#0f9d6b",
        danger: "#dc2626",
        warning: "#b45309",
        // ── Bleus de minuit ──────────────────────────────────
        // Réutilisables tels quels quand une surface doit rester sombre
        // dans les deux thèmes.
        space: {
          980: "#050810",
          950: "#070b14",
          900: "#0a1020",
          880: "#0d1526",
          850: "#0f1829",
          800: "#131f33",
          750: "#18253c",
          700: "#1f2d47",
        },
        // Blancs nuage : le neutre froid qui accompagne le bleu.
        lavender: {
          100: "#f4f7fb",
          200: "#dbe3ee",
          300: "#aebbce",
          400: "#8294ae",
          500: "#64748f",
        },
        // L'azur ne sert qu'aux dégradés et aux lueurs.
        eclat: "#38bdf8",
        argent: { 300: "#e2e8f0", 400: "#cbd5e1", 500: "#94a3b8" },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Space Grotesk", "Inter Tight", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      screens: {
        xs: "450px",
      },
      borderRadius: {
        "3xl": "28px",
        "4xl": "36px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lueur: "var(--glow-primary)",
        accent: "var(--lueur-accent)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "fade-in-down": "fadeInDown 0.6s ease-out both",
        "fade-in-left": "fadeInLeft 0.6s ease-out both",
        "scale-in": "scaleIn 0.4s ease-out both",
        "glow-pulse": "glowPulse 2.6s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 1.4s ease infinite",
        "float-slow": "float 6s ease-in-out infinite",
        levitation: "levitation 7s ease-in-out infinite",
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
          "0%,100%": { boxShadow: "0 0 24px rgba(46,125,255,0.25)" },
          "50%": { boxShadow: "0 0 48px rgba(46,125,255,0.5)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        levitation: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          from: { backgroundPosition: "-400px 0" },
          to: { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
