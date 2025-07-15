/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#f8f8f8',
        card: '#ffffff',
        texto: '#111111',
        gris: '#a1a1a1',
        negro: '#000000',
        blanco: '#ffffff',
        acento: '#e11d48',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'ping-short': 'ping 0.5s cubic-bezier(0, 0, 0.2, 1)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar')
  ],
}
