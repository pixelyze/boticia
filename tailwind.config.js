/** @type {import('tailwindcss').Config} */
export default {
  // Les effets de survol (hover:) ne s'appliquent qu'aux appareils avec une
  // souris : sur téléphone, ils restaient « collés » après un tap.
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      colors: {
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        sage: "#8B9D77",
        terracotta: "#C4784B",
        dark: "#2B2B2B",
        // Design « gravure et encre » : couleurs pilotées par la palette
        // choisie (composables/useEditorialPalette.ts)
        ed: {
          ground: "rgb(var(--ed-ground) / <alpha-value>)",
          ink: "rgb(var(--ed-ink) / <alpha-value>)",
          circle: "rgb(var(--ed-circle) / <alpha-value>)",
          tint: "rgb(var(--ed-tint) / <alpha-value>)",
          accent: "rgb(var(--ed-accent) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Source Sans 3", "sans-serif"],
        heading: ["Playfair Display", "serif"],
        // Guillemets obligatoires : sans eux, le « 4 » rend la déclaration
        // CSS invalide et le navigateur l'ignore.
        editorial: ['"Source Serif 4"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
