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
}) => {
    const hideClass = hideOnMobile ? 'hidden sm:flex' : 'flex';
    const isModified = Math.abs(zoom - 1) > 0.01;

    return (
        <div
            className={`${hideClass} items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-lg p-0.5 ${className}`}
        >
            <button
                onClick={onZoomOut}
                disabled={zoom <= minZoom}
                className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white hover:border hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-800 transition-all duration-100 active:scale-90"
                aria-label="Alejar"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
                    <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
            </button>

            <div className="w-px h-3.5 bg-slate-200 mx-0.5" />

            <button
                onClick={onZoomReset}
                className={`flex items-center justify-center h-7 px-2 rounded-md text-xs font-medium tabular-nums transition-all duration-100 active:scale-95 ${isModified
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-pointer hover:brightness-95'
                        : 'text-slate-500 cursor-default'
                    }`}
                style={{ minWidth: '2.5rem', letterSpacing: '0.02em' }}
                title={isModified ? 'Click para resetear' : undefined}
            >
                {Math.round(zoom * 100)}%
            </button>

            <div className="w-px h-3.5 bg-slate-200 mx-0.5" />

            <button
                onClick={onZoomIn}
                disabled={zoom >= maxZoom}
                className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white hover:border hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:text-slate-800 transition-all duration-100 active:scale-90"
                aria-label="Acercar"
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
                    <line x1="8" y1="3" x2="8" y2="13" />
                    <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
            </button>
        </div>
    );
};

export default ZoomControls;
