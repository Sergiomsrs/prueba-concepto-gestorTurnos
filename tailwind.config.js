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
        '.half-height-border::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: '0',
          height: '50%',
          width: '1px', // Asegúrate de que el grosor sea el mismo
          backgroundColor: 'grey',
        },
      });
    },
  ],
};