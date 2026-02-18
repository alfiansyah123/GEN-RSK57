/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#10b981", // Emerald 500
        "secondary": "#064e3b", // Emerald 900
        "text-muted": "#6ee7b7", // Emerald 300 (light green text)
        "background-light": "#f0fdf4", // Light green background for light mode
        "background-dark": "#020617", // Slate 950 (Deep Black/Blue) or just #000000
        "surface-dark": "#0f172a", // Slate 900
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
  plugins: [],
}
