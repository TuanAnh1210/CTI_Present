import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cti: {
          green: "#00833E",
          yellow: "#FDB719",
          ink: "#122118",
          paper: "#FFFFFF",
          wash: "#F6FAF7",
        },
      },
      boxShadow: {
        soft: "0 18px 48px rgba(0, 99, 46, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
