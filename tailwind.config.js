/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./scrapbook.html",
    "./memphis.html",
    "./risograph.html",
    "./index-standalone.html",
    "./index-scrapbook.html",
    "./index-memphis.html",
    "./index-risograph.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'Nunito', 'system-ui', 'sans-serif'],
        hand: ['"Patrick Hand"', '"Caveat"', 'cursive'],
        serifHand: ['"Caveat"', 'cursive'],
        memphis: ['"Outfit"', '"Space Grotesk"', 'sans-serif'],
        riso: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
