import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ocean: {
          bg: "#0d1117",
          sidebar: "#0f141c",
          search: "#181f28",
          card: "#162a2d",
          slash: "#151c24",
          slashActive: "#16383a",
          badge: "#153e44",
          cyan: "#2dd4bf",
          border: "#14b8a6",
          textWhite: "#f8fafc",
          textBody: "#cbd5e1",
          textMuted: "#8e9fac",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
