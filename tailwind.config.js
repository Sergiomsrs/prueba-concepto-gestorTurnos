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
				appPrimary: {
					DEFAULT: 'hsl(var(--app-primary))',
					foreground: 'hsl(var(--app-primary-foreground))',
					hover: 'hsl(var(--app-primary-hover))',
					light: 'hsl(var(--app-primary-light))',
					text: 'hsl(var(--app-primary-text))',
					border: 'hsl(var(--app-primary))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))'
			}
		}
	},

	plugins: [
		// Utilidades personalizadas y de impresión
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
				".print-break-after": { "page-break-after": "always" },
				".print-break-before": { "page-break-before": "always" },
				".print-break-inside-avoid": { "page-break-inside": "avoid" },
				".print-break-inside-auto": { "page-break-inside": "auto" },
			});
		},
		require("tailwindcss-animate")
	],
};
