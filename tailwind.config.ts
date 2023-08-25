/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  safelist: [ 
    "hover:bg-[1da1f2]",
    "hover:bg-[2c3646]",
    "hover:bg-[7289da]" 
  ],
  theme: {
    extend: {
      screens: {
        xs: "500px",
      },
      colors: {
        primary: "#0f172a",
        "light-bg": "#f8fafc",
        "primary-light": "#1e293b",
        green: "#22C55E",
        secondary: "#2563eb",
        yellow: "#facc15",
        border: "#2c3646",
        "border-light": "#d4d7dacc",
        "text-primary": "#94a3b8",
        "text-secondary": "#e2e8f0",
        red: "#dc2626",
        twitterColor: "#1da1f2",
        linkedinColor: "#0077b5",
        instaColor: "#e1306c",
        discordColor: "#7289da",
      },
    },
  },
  plugins: [],
} as Config;
