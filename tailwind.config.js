/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|ring|border)-(indigo|blue|sky|cyan|emerald|orange|red|fuchsia|pink|yellow|teal|violet|purple|lime|rose|slate|gray)-(50|100|200|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
