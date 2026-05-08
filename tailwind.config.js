/** @type {import('tailwindcss').Config} */
export default {
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
      },
      fontFamily: {
        sans: ["Source Sans 3", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
