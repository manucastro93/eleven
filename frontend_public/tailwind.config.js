/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#f5f3f0',         // fondo general cálido
        card: '#ffffff',          // fondo de tarjetas
        texto: '#1e1e1e',         // texto principal
        gris: '#a1a1a1',          // texto secundario
        dorado: '#b8860b',        // acento dorado
        crema: '#fafafa',         // alternativo para secciones claras
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
