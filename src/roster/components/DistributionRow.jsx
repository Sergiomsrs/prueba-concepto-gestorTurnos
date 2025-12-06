import { memo, useMemo, useState } from 'react';

export const DistributionRow = memo(({ day, originalDay }) => {
    // Estado local para el toggle
    const [showFullDistribution, setShowFullDistribution] = useState(false);

    // Decidir qué datos usar según el toggle
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

    return (
        <>
            <div className="bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 border-r flex items-center">
                Total
            </div>
            <button
                onClick={() => setShowFullDistribution(!showFullDistribution)}
                className="bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700 border-r flex items-center"
            >
                Personas
            </button>
            {sumaPorIndice.map((valor, index) => (
                <div key={index} className="bg-gray-300 flex items-center justify-center p-0.5">
                    <span className="text-center font-semibold text-xs text-gray-700">
                        {valor}
                    </span>
                </div>
            ))}
        </>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.day === nextProps.day &&
        prevProps.originalDay === nextProps.originalDay
    );
});
