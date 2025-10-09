# Gestión de Turnos de Trabajo - Prueba de Concepto

## Descripción

Este proyecto es una prueba de concepto de una aplicación para gestionar turnos de trabajo. El objetivo es evaluar las mejores formas de abordar el proyecto, recopilar la información necesaria y definir las características esenciales que debería tener una aplicación de este estilo.


## Estado del Proyecto

Actualmente, el proyecto está en una etapa inicial y no se encuentra en un estado funcional. Se están explorando diversas tecnologías y enfoques para determinar la mejor manera de implementar las características planificadas.

# Instalar dependencias Testing

1. [Vitest](https://vitest.dev/guide/)

```bash
npm install --save-dev vitest jsdom
```

2. React [Testing Library](https://testing-library.com/docs/react-testing-library/intro)

```bash
npm install --save-dev @testing-library/react @testing-library/dom
```

- Todo en un sólo comando

```bash
npm install --save-dev @testing-library/react @testing-library/dom vitest jsdom
```

3. Crear estos scripts en el `package.json`

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest run --coverage"
}
```

4. Configurar `vite.config.ts`
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```
