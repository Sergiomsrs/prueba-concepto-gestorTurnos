import { memo, useMemo, useContext } from 'react';
import { getVisibleRange } from '../../utils/rangeCalculator';
import { AppContext } from '../../context/AppContext';

const getHeatColor = (value, max) => {
    if (max === 0 || value === 0) return null;

    const ratio = value / max;

    if (ratio <= 0.2) return 'rgba(203, 213, 225, 0.35)'; // slate-300 — muy sutil
    if (ratio <= 0.4) return 'rgba(148, 163, 184, 0.40)'; // slate-400
    if (ratio <= 0.6) return 'rgba(100, 116, 139, 0.38)'; // slate-500
    if (ratio <= 0.8) return 'rgba( 71,  85, 105, 0.36)'; // slate-600
    return 'rgba( 51,  65,  85, 0.34)'; // slate-700 — pico, capped para legibilidad
};

const getTextColor = (value, max) => {
    if (max === 0 || value === 0) return 'transparent';
    // Slate oscuro fijo — siempre legible sobre cualquier nivel del fondo acotado
    return '#1e293b'; // slate-800
};

export const DistributionRow = memo(({ day, originalDay, showFullDistribution, onToggle }) => {
    const { filters } = useContext(AppContext);
    const dataToUse = showFullDistribution && originalDay ? originalDay : day;

    const rangeConfig = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        return getVisibleRange(displayRange.startHour, displayRange.endHour);
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    const sumaPorIndice = useMemo(() => {
        if (!dataToUse?.employees?.length) return new Array(rangeConfig.visibleSlots).fill(0);
        const sums = new Array(rangeConfig.visibleSlots).fill(0);
        for (const emp of dataToUse.employees) {
            for (let i = 0; i < rangeConfig.visibleSlots; i++) {
                const absoluteIndex = rangeConfig.startIndex + i;
                if (emp.workShift[absoluteIndex] === "WORK") sums[i]++;
            }
        }
        return sums;
    }, [dataToUse?.employees, rangeConfig]);

    const maxValue = useMemo(() => Math.max(...sumaPorIndice), [sumaPorIndice]);

    return (
        <>
            {/* Celda equipo — discreta, mismo fondo que filas */}
            <div className="bg-white border-t border-slate-100 px-3 flex items-center">
                <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest select-none">

                </span>
            </div>

            {/* Botón toggle — muestra si está viendo distribución filtrada o completa */}
            <button
                onClick={onToggle}
                className="bg-white border-t border-slate-100 border-r border-slate-100 px-3 flex items-center justify-between group hover:bg-slate-50 transition-colors duration-150"
                title={showFullDistribution ? "Mostrando distribución completa — click para ver filtrada" : "Mostrando distribución filtrada — click para ver todos"}
            >
                <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors duration-150 select-none">
                    {showFullDistribution ? 'total' : 'filtro'}
                </span>
                {/* Indicador visual de modo activo */}
                <span
                    className="w-1.5 h-1.5 rounded-full ml-2 flex-shrink-0 transition-colors duration-150"
                    style={{
                        backgroundColor: showFullDistribution
                            ? 'rgba(147, 51, 234, 0.6)'   // purple — modo completo
                            : 'rgba(148, 163, 184, 0.4)', // slate  — modo filtrado
                    }}
                />
            </button>

            {/* Celdas heatmap — color rellena toda la celda, número flotando arriba */}
            {Array.from({ length: rangeConfig.visibleSlots }, (_, relativeIndex) => {
                const valor = sumaPorIndice[relativeIndex] ?? 0;
                const color = getHeatColor(valor, maxValue);
                const textColor = getTextColor(valor, maxValue);
                const absoluteIndex = rangeConfig.startIndex + relativeIndex;

                return (
                    <div
                        key={absoluteIndex}
                        className="border-t border-slate-100 transition-colors duration-200 flex items-start justify-center"
                        style={{
                            backgroundColor: color ?? 'transparent',
                            paddingTop: '3px',
                            // Resalte sutil en picos máximos
                            boxShadow: 'none',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: textColor,
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                                transition: 'color 200ms ease',
                            }}
                        >
                            {valor > 0 ? valor : ''}
                        </span>
                    </div>
                );
            })}
        </>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.day === nextProps.day &&
        prevProps.originalDay === nextProps.originalDay &&
        prevProps.showFullDistribution === nextProps.showFullDistribution
    );
});

DistributionRow.displayName = 'DistributionRow';