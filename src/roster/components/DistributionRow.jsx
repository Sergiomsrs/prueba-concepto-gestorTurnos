import { memo, useMemo } from 'react';

export const DistributionRow = memo(({ day }) => {
    const sumaPorIndice = useMemo(() => {
        if (!day?.employees?.length) return new Array(62).fill(0);

        const sums = new Array(day.employees[0].workShift.length).fill(0);
        for (const emp of day.employees) {
            for (let i = 0; i < emp.workShift.length; i++) {
                if (emp.workShift[i] === "WORK") sums[i]++;
            }
        }
        return sums;
    }, [day.employees]);

    return (
        <>
            <div className="bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 border-r flex items-center">
                Total
            </div>
            <div className="bg-gray-300 px-3 py-2 text-sm font-medium text-gray-700 border-r flex items-center">
                Personas
            </div>
            {sumaPorIndice.map((valor, index) => (
                <div key={index} className="bg-gray-300 flex items-center justify-center p-0.5">
                    <span className="text-center font-semibold text-xs text-gray-700">
                        {valor}
                    </span>
                </div>
            ))}
        </>
    );
}, (prevProps, nextProps) => prevProps.day === nextProps.day);
