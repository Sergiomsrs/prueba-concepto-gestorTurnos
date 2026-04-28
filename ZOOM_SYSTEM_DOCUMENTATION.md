# 🔍 Sistema de Control de Zoom - Documentación

## Descripción General

Se ha implementado un sistema completo de zoom para la página de Roster que permite a los usuarios:
- Aumentar/disminuir el nivel de zoom de la tabla de horarios
- Usar Ctrl+Scroll para cambiar el zoom de forma intuitiva
- Restablecer el zoom a 100%
- Controles responsivos que se adapten a diferentes tamaños de pantalla

## Componentes Implementados

### 1. **Hook `useGridZoom`** (`src/Hooks/useGridZoom.js`)

Hook personalizado que gestiona toda la lógica de zoom.

**Parámetros:**
```javascript
useGridZoom(
  initialZoom = 1,    // Zoom inicial (1 = 100%)
  minZoom = 0.5,      // Zoom mínimo permitido
  maxZoom = 2,        // Zoom máximo permitido
  step = 0.1          // Incremento por acción
)
```

**Retorna:**
```javascript
{
  zoom,                  // Nivel de zoom actual
  containerRef,          // Ref para el contenedor
  handleZoomIn,          // Función para aumentar zoom
  handleZoomOut,         // Función para disminuir zoom
  handleZoomReset,       // Función para resetear zoom
  handleGridWheel,       // Manejador automático de Ctrl+Scroll
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP
}
```

**Ejemplo de uso:**
```javascript
const {
  zoom,
  containerRef,
  handleZoomIn,
  handleZoomOut,
  handleZoomReset
} = useGridZoom(1, 0.5, 2, 0.1);
```

### 2. **Componente `ZoomControls`** (`src/components/ZoomControls.jsx`)

Componente de UI reutilizable para mostrar los controles de zoom.

**Props:**
```javascript
<ZoomControls
  zoom={gridZoom}              // Nivel de zoom actual
  onZoomIn={handleZoomIn}      // Callback para aumentar
  onZoomOut={handleZoomOut}    // Callback para disminuir
  onZoomReset={handleZoomReset} // Callback para resetear
  minZoom={0.5}                // Zoom mínimo
  maxZoom={2}                  // Zoom máximo
  hideOnMobile={true}          // Ocultar en móviles
  className=""                 // Clases CSS adicionales
  title="Controles de Zoom"    // Tooltip
/>
```

### 3. **Estilos CSS** (`src/styles-zoom.css`)

Estilos optimizados para la experiencia de zoom:
- Animaciones suaves
- Scrollbar personalizada
- Optimizaciones para dispositivos móviles
- Estados de botones (hover, active, disabled)

## Uso en RosterPage

### Inicialización:
```javascript
// En RosterPage.jsx
const {
  zoom: gridZoom,
  containerRef: gridContainerRef,
  handleZoomIn,
  handleZoomOut,
  handleZoomReset,
  MIN_ZOOM,
  MAX_ZOOM,
} = useGridZoom(1, 0.5, 2, 0.1);
```

### Aplicación del zoom al grid:
```jsx
<div className="grid-zoom-container" ref={gridContainerRef}>
  <div
    className="grid bg-slate-200 min-w-max"
    style={{
      gridTemplateColumns: gridColumns,
      transform: `scale(${gridZoom})`,
      transformOrigin: 'top left',
      transition: 'transform 150ms ease-out',
    }}
  >
    {/* Grid content */}
  </div>
</div>
```

### Controles en la UI:
```jsx
<ZoomControls
  zoom={gridZoom}
  onZoomIn={handleZoomIn}
  onZoomOut={handleZoomOut}
  onZoomReset={handleZoomReset}
  minZoom={MIN_ZOOM}
  maxZoom={MAX_ZOOM}
  hideOnMobile={true}
/>
```

## Características

### ✅ Funcionalidades implementadas:

1. **Controles visuales:**
   - Botón de aumentar zoom (+)
   - Botón de disminuir zoom (−)
   - Indicador porcentual (50%, 100%, 150%, etc.)
   - Botón de restablecer (↺)

2. **Interacción por teclado/ratón:**
   - Ctrl + Scroll para cambiar zoom
   - Botones con hover y estados activos
   - Deshabilitación automática en límites

3. **Responsividad:**
   - Ocultos en dispositivos móviles por defecto
   - Escalado adaptativo en tablets
   - Visibles en pantallas grandes (sm: breakpoint)

4. **Optimizaciones:**
   - Transform: scale() para mejor rendimiento
   - Hardware acceleration (backface-visibility)
   - Transiciones suaves (150ms)
   - Will-change para animaciones

## Límites de Zoom

| Nivel | Porcentaje | Casos de uso |
|-------|-----------|------------|
| Mínimo | 50% | Ver más celdas, menos detalle |
| Normal | 100% | Tamaño por defecto |
| Máximo | 200% | Ver más detalle, menos celdas |

## Reutilización

### Usar en otro componente:

```javascript
import { useGridZoom } from "@/Hooks/useGridZoom";
import { ZoomControls } from "@/components/ZoomControls";

export const MyGridComponent = () => {
  const {
    zoom,
    containerRef,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    MIN_ZOOM,
    MAX_ZOOM
  } = useGridZoom();

  return (
    <div ref={containerRef} className="grid-zoom-container">
      <div style={{ transform: `scale(${zoom})` }}>
        {/* Grid content */}
      </div>
      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      />
    </div>
  );
};
```

## Adaptación a Pantallas Pequeñas

### Estrategias implementadas:

1. **Controles responsivos:**
   - Ocultos en SM (< 640px) por defecto
   - Visibles en SM+ (≥ 640px)
   - Puede modificarse con prop `hideOnMobile`

2. **Zoom automático:**
   - En móviles, el zoom inicial puede ser < 100% para ver más datos
   - Límites pueden ajustarse por tamaño de pantalla

3. **Scrollbar mejorada:**
   - Altura de 8px
   - Colores personalizados
   - Mejor visibilidad en zoom

### Personalización para móviles:

```javascript
// En dispositivos móviles, iniciar con zoom reducido
const isSmallScreen = window.innerWidth < 768;
const initialZoom = isSmallScreen ? 0.75 : 1;

const { zoom, containerRef, ... } = useGridZoom(initialZoom, 0.5, 2, 0.1);
```

## Notas de Rendimiento

- **Transform vs Width:** Se usa `transform: scale()` en lugar de cambiar anchos para mejor rendimiento
- **Hardware Acceleration:** Activada con `perspective: 1000px`
- **Transiciones:** 150ms es el tiempo óptimo (fast pero visible)
- **Will-change:** Usado solo cuando necesario

## Troubleshooting

### El zoom no funciona:
1. Verificar que `gridContainerRef` esté assignado al contenedor
2. Asegurar que Ctrl+Scroll no esté siendo interceptado por el navegador
3. Revisar que el hook esté siendo llamado en el componente

### Rendimiento lento:
1. Verificar límites de zoom (MAX_ZOOM = 2 es recomendado)
2. Revisar que no haya muchos renders innecesarios
3. Usar DevTools para profilear

### Controles no visibles:
1. Revisar breakpoint SM en Tailwind
2. Cambiar `hideOnMobile` a false en `ZoomControls`
3. Verificar z-index del header

## Futuras Mejoras

- [ ] Guardar preferencia de zoom en localStorage
- [ ] Zoom diferente por tipo de dispositivo
- [ ] Atajos de teclado personalizables
- [ ] Zoom persistente entre navegaciones
- [ ] Animación suave del zoom (easing)
- [ ] Doble-click para auto-zoom al contenido
