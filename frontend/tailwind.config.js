/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          600: '#1A8917',
          700: '#156c12',
          800: '#10520d'
        }
      }
    },
  },
  plugins: [],
}
