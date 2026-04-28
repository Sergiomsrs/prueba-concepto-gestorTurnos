import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * ✅ Hook personalizado para gestionar zoom en grillas/tablas
 * 
 * Proporciona:
 * - Estado de zoom
 * - Funciones para aumentar/disminuir/resetear zoom
 * - Manejador de eventos para Ctrl+Scroll
 * - Ref para el contenedor
 * 
 * @param {number} initialZoom - Zoom inicial (default: 1)
 * @param {number} minZoom - Zoom mínimo permitido (default: 0.5)
 * @param {number} maxZoom - Zoom máximo permitido (default: 2)
 * @param {number} step - Incremento por cada acción (default: 0.1)
 * 
 * @returns {object} Objeto con:
 *   - zoom: nivel de zoom actual
 *   - containerRef: ref para el contenedor
 *   - handleZoomIn: función para aumentar zoom
 *   - handleZoomOut: función para disminuir zoom
 *   - handleZoomReset: función para resetear zoom
 *   - handleGridWheel: manejador de eventos wheel (ya está attachado)
 *   - MIN_ZOOM, MAX_ZOOM, ZOOM_STEP: constantes
 */
export const useGridZoom = (initialZoom = 1, minZoom = 0.5, maxZoom = 2, step = 0.1) => {
    const [zoom, setZoom] = useState(initialZoom);
    const containerRef = useRef(null);

    const MIN_ZOOM = minZoom;
    const MAX_ZOOM = maxZoom;
    const ZOOM_STEP = step;

    // Funciones de control de zoom
    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    }, [MAX_ZOOM, ZOOM_STEP]);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    }, [MIN_ZOOM, ZOOM_STEP]);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
    }, []);

    // Manejador para Ctrl+Scroll
    const handleGridWheel = useCallback((e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    }, [handleZoomIn, handleZoomOut]);

    // Efecto para attachar listener de wheel
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleGridWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleGridWheel);
    }, [handleGridWheel]);

    return {
        zoom,
        containerRef,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleGridWheel,
        MIN_ZOOM,
        MAX_ZOOM,
        ZOOM_STEP,
    };
};

export default useGridZoom;
