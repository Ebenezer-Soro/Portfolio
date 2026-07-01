import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ea5e9",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        accent: { DEFAULT: "#6366f1", hover: "#818cf8" },
        accent2: { DEFAULT: "#8b5cf6" },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
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
          "0%,100%": { boxShadow: "0 0 20px rgba(14,165,233,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(14,165,233,0.6)" },
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
