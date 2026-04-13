
import { memo, useMemo, useContext } from 'react';
import { getVisibleRange } from '../../utils/rangeCalculator';
import { AppContext } from '../../context/AppContext';

const SLOT_WIDTH = 20;

export const HeadRow = memo(() => {
    const { filters } = useContext(AppContext);

    // ✅ Cachear el cálculo del rango (con valores por defecto)
    const rangeConfig = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        return getVisibleRange(displayRange.startHour, displayRange.endHour);
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    // ✅ Pre-calcular horas visibles solo una vez
    const visibleHours = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        const hours = [];
        const startHour = Math.floor(displayRange.startHour);
        const endHour = Math.ceil(displayRange.endHour);

        for (let h = startHour; h <= endHour; h++) {
            hours.push(h);
        }
        return hours;
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    return (
        <div
            className="relative bg-slate-100"
            style={{
                gridColumn: `span ${rangeConfig.visibleSlots}`,
                height: '44px',
                width: `${rangeConfig.visibleSlots * SLOT_WIDTH}px`,
                borderBottom: '0.5px solid #94a3b8',
            }}
        >
            {/* Ticks de media hora (solo del rango visible) */}
            {Array.from({ length: rangeConfig.visibleSlots + 1 }, (_, i) => {
                const absoluteIndex = rangeConfig.startIndex + i;
                const isHour = absoluteIndex % 4 === 0;
                const isHalf = absoluteIndex % 2 === 0 && !isHour;

                if (!isHour && !isHalf) return null;

                return (
                    <div
                        key={`tick-${absoluteIndex}`}
                        className="absolute bottom-0"
                        style={{
                            left: `${i * SLOT_WIDTH}px`,
                            transform: 'translateX(-50%)',
                            width: '1px',
                            height: isHour ? '12px' : '6px',
                            backgroundColor: isHour ? '#475569' : '#94a3b8',
                            borderRadius: '1px',
                        }}
                    />
                );
            })}

            {/* Etiquetas de hora (solo horas dentro del rango) */}
            {visibleHours.map((hour) => {
                const index = hour * 4; // Índice absoluto
                const relativeIndex = index - rangeConfig.startIndex;

                if (relativeIndex < 0 || relativeIndex > rangeConfig.visibleSlots) {
                    return null;
                }

                const leftPx = relativeIndex * SLOT_WIDTH;

                return (
                    <div
                        key={`label-${hour}`}
                        className="absolute flex items-center justify-center"
                        style={{
                            left: `${leftPx}px`,
                            transform: 'translateX(-50%)',
                            top: '8px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '13px',
                                fontFamily: 'monospace',
                                fontWeight: '700',
                                color: '#1e293b',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {String(hour).padStart(2, '0')}:00
                        </span>
                    </div>
                );
            })}
        </div>
    );
}, (prevProps, nextProps) => {
    // ✅ Custom comparison para evitar re-renders innecesarios
    // React.memo con función de comparación inversa: retorna true si son iguales (NO renderear)
    return true; // HeadRow no tiene props, siempre es igual
});