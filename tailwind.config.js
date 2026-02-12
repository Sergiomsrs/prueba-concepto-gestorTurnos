/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
  	extend: {
  		borderWidth: {
  			'half-height': '2px'
  		},
  		height: {
  			half: '50%'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
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
      require("tailwindcss-animate")
],
};
