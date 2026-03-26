import { memo, useMemo } from 'react';

const getHeatColor = (value, max) => {
    if (max === 0 || value === 0) return null;

    const ratio = value / max;

    if (ratio <= 0.2) return 'rgba(226, 232, 240, 0.4)'; // slate-200
    if (ratio <= 0.4) return 'rgba(191, 219, 254, 0.5)'; // blue-200
    if (ratio <= 0.6) return 'rgba(147, 197, 253, 0.6)'; // blue-300
    if (ratio <= 0.8) return 'rgba(96, 165, 250, 0.65)'; // blue-400
    return 'rgba(59, 130, 246, 0.7)';                   // blue-500
};

export const DistributionRow = memo(({ day, originalDay, showFullDistribution, onToggle }) => {
    const dataToUse = showFullDistribution && originalDay ? originalDay : day;

    const sumaPorIndice = useMemo(() => {
        if (!dataToUse?.employees?.length) return new Array(62).fill(0);
        const sums = new Array(dataToUse.employees[0].workShift.length).fill(0);
        for (const emp of dataToUse.employees) {
            for (let i = 0; i < emp.workShift.length; i++) {
                if (emp.workShift[i] === "WORK") sums[i]++;
            }
        }
        return sums;
    }, [dataToUse?.employees]);

    const maxValue = useMemo(() => Math.max(...sumaPorIndice), [sumaPorIndice]);

    return (
        <>
            <div className="bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 border-r flex items-center">
                Total
            </div>
            <button
                onClick={onToggle}
                className="bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 border-r flex items-center justify-between"
                title={showFullDistribution ? "Mostrando distribución completa" : "Mostrando distribución filtrada"}
            >
                <span>Personas</span>
                {showFullDistribution && (
                    <span className="ml-2 text-purple-600 text-xs font-bold">📊</span>
                )}
            </button>

            {sumaPorIndice.map((valor, index) => {
                const color = getHeatColor(valor, maxValue);
                return (
                    <div
                        key={index}
                        className="bg-slate-200 flex items-center justify-center"
                    >
                        <div
                            className="flex items-center justify-center rounded-sm transition-all duration-200"
                            style={{
                                width: '19px',
                                height: '18px',
                                margin: '1px',
                                backgroundColor: color ?? 'transparent',
                                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: valor > 0 ? '#334155' : 'transparent',
                                    lineHeight: 1,
                                }}
                            >
                                {valor > 0 ? valor : ''}
                            </span>
                        </div>
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