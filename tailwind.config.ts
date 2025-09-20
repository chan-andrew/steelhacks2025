import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          black: "#000000",
          white: "#ffffff",
        },
        accent: {
          gold: "#FFD700",
          "gold-light": "#FFED4E",
          "gold-dark": "#B8860B",
          blue: "#4169E1",
          "blue-light": "#6495ED",
          "blue-dark": "#191970",
        },
        glass: {
          "black-10": "rgba(0, 0, 0, 0.1)",
          "black-20": "rgba(0, 0, 0, 0.2)",
          "black-30": "rgba(0, 0, 0, 0.3)",
          "white-10": "rgba(255, 255, 255, 0.1)",
          "white-20": "rgba(255, 255, 255, 0.2)",
          "white-30": "rgba(255, 255, 255, 0.3)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "zoom-in": "zoomIn 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
