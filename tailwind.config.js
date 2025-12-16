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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
    },
  },

  plugins: [
    // Tu plugin actual
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

    // ⭐ Nuevo plugin para impresión
    function ({ addUtilities }) {
      const printUtilities = {
        ".print-break-after": { "page-break-after": "always" },
        ".print-break-before": { "page-break-before": "always" },
        ".print-break-inside-avoid": { "page-break-inside": "avoid" },
        ".print-break-inside-auto": { "page-break-inside": "auto" },
      };

      addUtilities(printUtilities, ["responsive", "print"]);
    },
  ],
};
