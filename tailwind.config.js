/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        'half-height': '2px',
      },
      height: {
        'half': '50%',
      },
      keyframes: {
        fadeIn: { // 👈 Keyframes personalizados
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out", // 👈 Animación personalizada
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.border-45-height::after': {
          content: '""',
          position: 'absolute',
          top: '80%',
          right: '0',
          height: '45%',
          width: '1.5px',
          backgroundColor: 'rgb(209 213 219)',
        },
      });
    },
  ],
};
