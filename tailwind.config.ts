/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        "light-bg": "#f8fafc",
        "primary-light": "#1e293b",
        green: "#14532d",
        secondary: "#2563eb",
        yellow: "#facc15",
        border: "#1e293b",
        "border-light": "#d4d7dacc",
        "text-primary": "#94a3b8",
        "text-secondary": "#e2e8f0",
        red: "#dc2626",
      },
    },
  },
  plugins: [],
} satisfies Config;
