import React from 'react';

/**
 * ✅ Componente de Controles de Zoom Reutilizable
 * 
 * @param {number} zoom - Nivel de zoom actual (ej: 1, 1.5, 2)
 * @param {function} onZoomIn - Callback al hacer click en botón de acercar
 * @param {function} onZoomOut - Callback al hacer click en botón de alejar
 * @param {function} onZoomReset - Callback al hacer click en botón de restablecer
 * @param {number} minZoom - Zoom mínimo permitido (por defecto 0.5)
 * @param {number} maxZoom - Zoom máximo permitido (por defecto 2)
 * @param {boolean} hideOnMobile - Ocultar en dispositivos móviles (por defecto true)
 * @param {string} className - Clases CSS adicionales
 * @param {string} title - Tooltip adicional
 */
export const ZoomControls = ({
    zoom = 1,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    minZoom = 0.5,
    maxZoom = 2,
    hideOnMobile = true,
    className = '',
    title = 'Controles de Zoom'
}) => {
    const hideClass = hideOnMobile ? 'hidden sm:flex' : 'flex';

    return (
        <div
            className={`${hideClass} items-center gap-1 pl-3 border-l border-slate-300 ${className}`}
            title={title}
        >
            {/* Botón Alejar */}
            <button
                onClick={onZoomOut}
                disabled={zoom <= minZoom}
                className="zoom-button p-1.5 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                title="Alejar (Ctrl + Scroll)"
                aria-label="Alejar"
            >
                −
            </button>

            {/* Indicador de Zoom */}
            <div className="zoom-indicator w-12 text-center text-xs font-medium text-slate-600">
                {Math.round(zoom * 100)}%
            </div>

            {/* Botón Acercar */}
            <button
                onClick={onZoomIn}
                disabled={zoom >= maxZoom}
                className="zoom-button p-1.5 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                title="Acercar (Ctrl + Scroll)"
                aria-label="Acercar"
            >
                +
            </button>

            {/* Botón Restablecer */}
            <button
                onClick={onZoomReset}
                className="zoom-button ml-1 px-2 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium transition-colors"
                title="Restablecer zoom (100%)"
                aria-label="Restablecer zoom"
            >
                ↺
            </button>
        </div>
    );
};

export default ZoomControls;
