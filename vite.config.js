import path from "path" // 1. Importamos path
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/prueba-concepto-gestorTurnos/',
  plugins: [react()],
  // 2. Añadimos la resolución de alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})