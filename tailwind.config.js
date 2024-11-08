/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        'half-height': '2px', // Asegúrate de que el grosor sea el mismo
      },
      height: {
        'half': '50%',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.border-45-height::after': {
          content: '""',
          position: 'absolute',
          top: '80%', // Empieza desde el 55% de la celda
          right: '0',
          height: '45%', // Ocupa el 45% de la altura de la celda
          width: '1.5px', // Grosor del borde
          backgroundColor: 'rgb(209 213 219)', // Color del borde
        },
      });
    },
  ],
};