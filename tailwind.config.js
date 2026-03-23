/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          950: '#020b08', 900: '#051611', 800: '#0a241c', 700: '#13382d',
          600: '#1a4538', 500: '#245a4a', 400: '#517568', 300: '#789e90',
          200: '#a0bdb2', 100: '#cde0d9', 50:  '#e2ede9',
        },
        gold: { 
          400: '#e8cd7d', 500: '#d4af37', 600: '#c29d2c' 
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}