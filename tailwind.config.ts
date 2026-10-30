import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1C2140", soft: "#5D6483", faint: "#8A90AA" },
        paper: "#F4F6FB",
        line: "#E2E6F0",
        spot: { DEFAULT: "#FFC530", deep: "#E5A800", wash: "#FFF4D6" },
        ok: { DEFAULT: "#17924B", wash: "#E3F5EA" },
        warn: { DEFAULT: "#B25E00", wash: "#FFF0DC" },
        bad: { DEFAULT: "#D2352B", wash: "#FDE7E5" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
