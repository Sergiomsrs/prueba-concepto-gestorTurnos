import React, { useMemo } from "react";
import { selectColor } from "../../utils/function";

// --- CONSTANTS ---
// Defining these outside ensures they are calculated only once, not on every render.
const START_HOUR = 7;
const TOTAL_SLOTS = 62;
const TIME_SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    const totalMinutes = START_HOUR * 60 + (i * 15);
    const hour = Math.floor(totalMinutes / 60);
    return {
        label: hour.toString().padStart(2, '0'),
        isHourStart: i % 4 === 0
    };
});

// --- MEMOIZED INTERNAL COMPONENTS ---

/**
 * Encabezado de la cuadrícula con las horas.
 * Optimizado: Usa la constante TIME_SLOTS pre-calculada.
 */
const PrintableHeadRow = React.memo(() => {
    return (
        <>
            {TIME_SLOTS.map((slot, i) => {
                const borderClass = slot.isHourStart
                    ? 'border-l-[0.2px] border-slate-300'
                    : 'border-l-[0.2px] border-slate-100';

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 h-3 flex items-center justify-center 
                            text-[5pt] relative
                            ${slot.isHourStart ? 'font-bold text-slate-700' : 'font-normal text-slate-400'}
                            ${borderClass}
                        `}
                    >
                        {slot.isHourStart ? slot.label : ""}
                    </div>
                );
            })}
        </>
    );
});

/**
 * Fila individual de un empleado.
 */
const PrintableEmployeeRow = React.memo(({ employee }) => {
    // Safety check for workShift
    const workShift = employee.workShift || [];
    const totalHours = (workShift.filter((w) => w === "WORK").length * 15) / 60;

    const getCellClasses = (value, isHourStart) => {
        const baseClasses = `h-3.5 flex items-center justify-center`;
        const borderClass = isHourStart
            ? 'border-l-[0.1px] border-slate-300'
            : 'border-l-[0.1px] border-slate-100';

        let backgroundClass = 'bg-slate-50';

        if (value === "CONFLICT") {
            backgroundClass = 'bg-amber-400';
        } else if (value === "WORK") {
            // Ensure selectColor returns a valid tailwind class
            backgroundClass = selectColor(employee.teamWork);
        }

        return `${baseClasses} ${backgroundClass} ${borderClass}`;
    };

    return (
        <div className="contents border-b-[0.5px] border-slate-200">
            {/* Team Column */}
            <div className="bg-white py-[1px] px-1.5 text-[6pt] font-semibold text-slate-800 border-r-[0.2px] border-slate-200 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.teamWork}
            </div>
            {/* Name Column */}
            <div className="bg-white py-[1px] px-1.5 text-[5.5pt] text-slate-600 border-r-[0.2px] border-slate-200 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.name} {employee.lastName}
            </div>

            {/* Time Grid */}
            {workShift.map((value, hourIndex) => (
                <div key={hourIndex} className={getCellClasses(value, hourIndex % 4 === 0)} />
            ))}

            {/* Total Hours Column */}
            <div className="bg-white py-[1px] px-1 text-[6pt] font-semibold text-slate-800 border-l-[0.2px] border-slate-200 flex items-center justify-center">
                {totalHours.toFixed(1)}
            </div>
        </div>
    );
});

/**
 * Fila de distribución de empleados por franja horaria.
 */
const PrintableDistributionRow = React.memo(({ day }) => {
    // Memoize the distribution calculation within the component to prevent recalc on non-data renders
    const distributionData = useMemo(() => {
        return Array.from({ length: TOTAL_SLOTS }, (_, i) =>
            day.employees?.reduce((acc, emp) => acc + (emp.workShift?.[i] === "WORK" ? 1 : 0), 0) || 0
        );
    }, [day.employees]);

    return (
        <>
            <div className="col-span-2 bg-slate-100 px-1.5 py-1 text-[5.5pt] font-semibold text-slate-600 flex items-center">
                Distribución
            </div>

            {distributionData.map((count, i) => {
                const borderClass = i % 4 === 0
                    ? 'border-l-[0.2px] border-slate-300'
                    : 'border-l-[0.1px] border-slate-100';

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 
                            flex items-center justify-center text-[5.5pt] font-bold 
                            ${borderClass}
                            ${count > 0 ? 'text-slate-800' : 'text-transparent'}
                        `}
                    >
                        {count}
                    </div>
                );
            })}
            <div className="bg-slate-100 border-t-[1px] border-b-[1px] border-b-slate-500 border-l-[0.5px] border-slate-200"></div>
        </>
    );
});

/**
 * Tabla de Resumen con datos de empleados
 */
const PrintableSummaryTable = React.memo(({ data }) => {
    const { employeesSummary, totalHours, totalWWH, totalVariation } = useMemo(() => {
        const employeeMap = new Map();

        data.forEach(day => {
            day.employees?.forEach(emp => {
                const key = `${emp.name} ${emp.lastName}`; // Consider using emp.id if available for uniqueness

                if (!employeeMap.has(key)) {
                    employeeMap.set(key, {
                        name: `${emp.name} ${emp.lastName}`,
                        teamWork: emp.teamWork,
                        totalHours: 0,
                        totalWWH: 0,
                    });
                }

                const employee = employeeMap.get(key);
                const workHours = (emp.workShift?.filter(w => w === "WORK").length * 15) / 60 || 0;

                employee.totalHours += workHours;

                // Logic: Accumulate WWH / 7 for each day present in the data
                if (emp.wwh) {
                    employee.totalWWH += emp.wwh / 7;
                }
            });
        });

        const summaryList = Array.from(employeeMap.values()).map(emp => ({
            ...emp,
            variation: emp.totalWWH - emp.totalHours
        }));

        const tHours = summaryList.reduce((sum, emp) => sum + emp.totalHours, 0);
        const tWWH = summaryList.reduce((sum, emp) => sum + emp.totalWWH, 0);

        return {
            employeesSummary: summaryList,
            totalHours: tHours,
            totalWWH: tWWH,
            totalVariation: tWWH - tHours
        };
    }, [data]);

    return (
        <section className="mt-8 break-inside-avoid border-[0.5px] border-slate-200 rounded-xl overflow-hidden">
            <header className="p-2 bg-slate-50 border-b-[0.5px] border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">📊 Resumen de Jornadas</h3>
                <p className="text-[8pt] text-slate-500">
                    Comparativa entre horas programadas (WWH) y horas trabajadas
                </p>
            </header>

            <div className="overflow-hidden">
                <table className="w-full text-[7pt]">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="text-left px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200">Empleado</th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">Equipo</th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">WWH</th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">Trabajadas</th>
                            <th className="px-2 py-1 font-semibold text-slate-700 text-center">Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesSummary.map((emp, index) => (
                            <tr key={index} className="border-b-[0.5px] border-slate-100 hover:bg-slate-50">
                                <td className="text-left px-2 py-1 font-medium text-slate-800 border-r-[0.5px] border-slate-200">{emp.name}</td>
                                <td className="px-2 py-1 text-slate-600 border-r-[0.5px] border-slate-200 text-center">{emp.teamWork}</td>
                                <td className="px-2 py-1 text-slate-700 border-r-[0.5px] border-slate-200 text-center">{emp.averageWWH ? emp.averageWWH.toFixed(1) : emp.totalWWH.toFixed(1)}</td>
                                <td className="px-2 py-1 text-slate-700 border-r-[0.5px] border-slate-200 text-center">{emp.totalHours.toFixed(1)}</td>
                                <td className={`px-2 py-1 text-center font-medium ${emp.variation >= 0 ? "text-green-700" : "text-red-700"}`}>
                                    {emp.variation >= 0 ? "+" : ""}{emp.variation.toFixed(1)}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-100 border-t-[1px] border-slate-300 font-semibold">
                            <td className="text-left px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200">TOTALES</td>
                            <td className="px-2 py-1.5 border-r-[0.5px] border-slate-200"></td>
                            <td className="px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200 text-center">{totalWWH.toFixed(1)}</td>
                            <td className="px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200 text-center">{totalHours.toFixed(1)}</td>
                            <td className={`px-2 py-1.5 text-center font-bold ${totalVariation >= 0 ? "text-green-700" : "text-red-700"}`}>
                                {totalVariation >= 0 ? "+" : ""}{totalVariation.toFixed(1)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
});

/**
 * Componente principal.
 */
export const PrintableRoster = React.forwardRef(({ data, filters }, ref) => {
    // Grid inline style extraction for cleaner JSX
    const gridStyle = {
        gridTemplateColumns: '1.5fr 2fr repeat(62, 0.5fr) 1fr',
    };

    return (
        <div ref={ref} className="font-sans bg-white">
            <style>{`
                @media print {
                    @page { 
                        size: A4 portrait; 
                        margin: 0.2in; 
                    } 
                    .print-container {
                        width: 8in !important;
                        min-width: 8in !important;
                        max-width: 8in !important;
                        overflow: visible !important;
                    }
                    .print-grid {
                        grid-template-columns: 0.6fr 1fr repeat(62, 0.08fr) 0.4fr !important;
                        width: 100% !important;
                    }
                    @media (max-width: 768px) {
                        .print-container { font-size: 90% !important; }
                        .print-grid { grid-template-columns: 0.5fr 0.9fr repeat(62, 0.075fr) 0.35fr !important; }
                    }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .day-section { break-inside: avoid; page-break-inside: avoid; }
                    table { width: 100% !important; }
                }
            `}</style>

            <div className="print-container">
                <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">WorkSchedFlow</h1>
                    <p className="text-sm text-slate-500">Gestión de equipos de trabajo</p>
                </header>

                {data.map((day) => {
                    const dailyTotalHours = (day.employees?.reduce((total, emp) =>
                        total + (emp.workShift?.filter(w => w === "WORK").length || 0), 0) || 0) * 0.25;

                    return (
                        <section key={day.id} className="day-section break-inside-avoid mb-6 border-[0.5px] border-slate-200 rounded-xl overflow-hidden">
                            {/* Header del Día */}
                            <header className="p-1 bg-slate-50 border-b-[0.5px] flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-lg">📅</div>
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-800 m-0">
                                            {new Date(day.id).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                        </h2>
                                        <p className="text-xs text-slate-500 capitalize mt-0.5">
                                            {day.day} • {day.employees?.length || 0} empleados
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-slate-800">
                                        {dailyTotalHours.toFixed(1)} horas
                                    </div>
                                    <div className="text-xs text-slate-500">Total del día</div>
                                </div>
                            </header>

                            {/* Grid de Turnos */}
                            <div>
                                <div className="print-grid grid bg-slate-200 border-t-[0.2px]" style={gridStyle}>
                                    <div className="bg-slate-200 px-1 py-0 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">Equipo</div>
                                    <div className="bg-slate-200 px-1 py-0 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">Empleado</div>

                                    <PrintableHeadRow />

                                    <div className="bg-slate-200 p-0 text-[7pt] font-semibold text-slate-600 flex items-center justify-center gap-1">⏰</div>

                                    {day.employees?.map((employee) => (
                                        <PrintableEmployeeRow key={employee.id} employee={employee} />
                                    ))}

                                    <PrintableDistributionRow day={day} />
                                </div>
                            </div>
                        </section>
                    );
                })}

                <PrintableSummaryTable data={data} />
            </div>
        </div>
    );
});

PrintableRoster.displayName = 'PrintableRoster';