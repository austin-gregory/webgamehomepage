import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        phosphor: {
          DEFAULT: "#00ff41",
          dim: "#008f11",
          glow: "#39ff14",
        },
        amber: {
          crt: "#ffb000",
          dim: "#cc8800",
        },
        neon: {
          cyan: "#00f0ff",
          pink: "#ff2ec4",
          violet: "#b026ff",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      animation: {
        flicker: "flicker 0.15s infinite",
        scanline: "scanline 8s linear infinite",
        glitch: "glitch 2.5s infinite",
        "boot-cursor": "blink 1s step-end infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
