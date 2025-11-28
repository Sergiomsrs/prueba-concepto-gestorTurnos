import React from "react";
import { selectColor } from "../../utils/function";

// --- COMPONENTES INTERNOS MEMOIZADOS ---

/**
 * Encabezado de la cuadrícula con las horas (cada 15 minutos).
 */
const PrintableHeadRow = React.memo(() => {
    const startHour = 7;
    const hours = Array.from({ length: 62 }, (_, i) => {
        const totalMinutes = startHour * 60 + (i * 15);
        const hour = Math.floor(totalMinutes / 60);
        return hour.toString().padStart(2, '0');
    });

    return (
        <>
            {hours.map((hour, i) => {
                const isHourStart = i % 4 === 0;
                const defaultBorder = 'border-l-[0.5px] border-slate-300';
                const specificBorder = isHourStart
                    ? 'border-l-[0.5px] border-slate-500'
                    : defaultBorder;

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 h-3 flex items-center justify-center 
                            text-[5pt] relative
                            ${isHourStart ? 'font-bold text-slate-700' : 'font-normal text-slate-400'}
                            ${specificBorder}
                        `}
                    >
                        {isHourStart ? hour : ""}
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
    const totalHours = (employee.workShift.filter((w) => w === "WORK").length * 15) / 60;

    const getCellClasses = (value, isHourStart) => {
        const baseClasses = `h-3.5 flex items-center justify-center`;
        const defaultBorder = 'border-l-[0.2px] border-slate-300';
        const borderLeftClass = isHourStart
            ? 'border-l-[0.2px] border-slate-500'
            : defaultBorder;

        let backgroundClass = 'bg-slate-50';
        if (value === "CONFLICT") {
            backgroundClass = 'bg-amber-400';
        } else if (value === "WORK") {
            backgroundClass = selectColor(employee.teamWork).replace('bg-', 'bg-');
        }

        return `${baseClasses} ${backgroundClass} ${borderLeftClass}`;
    };

    return (
        <div className="contents border-b-[0.5px] border-slate-200">
            <div className="bg-white py-[1px] px-1.5 text-[6pt] font-semibold text-slate-800 border-r-[0.2px] border-slate-200 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.teamWork}
            </div>
            <div className="bg-white py-[1px] px-1.5 text-[5.5pt] text-slate-600 border-r-[0.2px] border-slate-200 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.name} {employee.lastName}
            </div>

            {employee.workShift.map((value, hourIndex) => (
                <div key={hourIndex} className={getCellClasses(value, hourIndex % 4 === 0)}>
                </div>
            ))}

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
    const distributionData = Array.from({ length: 62 }, (_, i) => day.employees?.reduce((acc, emp) => acc + (emp.workShift[i] === "WORK" ? 1 : 0), 0) || 0);

    return (
        <>
            <div className="col-span-2 bg-slate-100 px-1.5 py-1 text-[5.5pt] font-semibold text-slate-600 flex items-center">
                Distribución
            </div>

            {distributionData.map((count, i) => {
                const defaultBorder = 'border-l-[0.2px] border-slate-300';
                const borderLeftClass = i % 4 === 0
                    ? 'border-l-[0.2px] border-slate-500'
                    : defaultBorder;

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 
                            flex items-center justify-center text-[5.5pt] font-bold 
                            ${borderLeftClass}
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
 * Tabla de Resumen con datos de empleados, WWH, horas trabajadas y diferencia
 */
const PrintableSummaryTable = React.memo(({ data }) => {
    // Calcular datos del resumen
    const employeesSummary = React.useMemo(() => {
        const employeeMap = new Map();

        // Recopilar información de todos los días
        data.forEach(day => {
            day.employees?.forEach(emp => {
                const key = `${emp.name} ${emp.lastName}`;

                if (!employeeMap.has(key)) {
                    employeeMap.set(key, {
                        name: key,
                        teamWork: emp.teamWork,
                        totalHours: 0,
                        totalWWH: 0,
                        dayCount: 0
                    });
                }

                const employee = employeeMap.get(key);
                // Calcular horas trabajadas desde workShift
                const workHours = (emp.workShift.filter(w => w === "WORK").length * 15) / 60;
                employee.totalHours += workHours;

                // Sumar WWH si existe
                if (emp.wwh) {
                    employee.totalWWH += emp.wwh / 7; // WWH dividido entre 7 días
                }
                employee.dayCount++;
            });
        });

        // Convertir a array y calcular diferencias
        return Array.from(employeeMap.values()).map(emp => ({
            ...emp,
            averageWWH: emp.totalWWH,
            variation: emp.totalWWH - emp.totalHours
        }));
    }, [data]);

    const totalHours = employeesSummary.reduce((sum, emp) => sum + emp.totalHours, 0);
    const totalWWH = employeesSummary.reduce((sum, emp) => sum + emp.averageWWH, 0);
    const totalVariation = totalWWH - totalHours;

    return (
        <section className="mt-8 break-inside-avoid border-[0.5px] border-slate-200 rounded-xl overflow-hidden">
            {/* Header del resumen */}
            <header className="p-2 bg-slate-50 border-b-[0.5px] border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">📊 Resumen de Jornadas</h3>
                <p className="text-[8pt] text-slate-500">
                    Comparativa entre horas programadas (WWH) y horas trabajadas
                </p>
            </header>

            {/* Tabla */}
            <div className="overflow-hidden">
                <table className="w-full text-[7pt]">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="text-left px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200">
                                Empleado
                            </th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">
                                Equipo
                            </th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">
                                WWH
                            </th>
                            <th className="px-2 py-1 font-semibold text-slate-700 border-r-[0.5px] border-slate-200 text-center">
                                Trabajadas
                            </th>
                            <th className="px-2 py-1 font-semibold text-slate-700 text-center">
                                Diferencia
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesSummary.map((emp, index) => (
                            <tr key={index} className="border-b-[0.5px] border-slate-100 hover:bg-slate-50">
                                <td className="text-left px-2 py-1 font-medium text-slate-800 border-r-[0.5px] border-slate-200">
                                    {emp.name}
                                </td>
                                <td className="px-2 py-1 text-slate-600 border-r-[0.5px] border-slate-200 text-center">
                                    {emp.teamWork}
                                </td>
                                <td className="px-2 py-1 text-slate-700 border-r-[0.5px] border-slate-200 text-center">
                                    {emp.averageWWH.toFixed(1)}
                                </td>
                                <td className="px-2 py-1 text-slate-700 border-r-[0.5px] border-slate-200 text-center">
                                    {emp.totalHours.toFixed(1)}
                                </td>
                                <td className={`px-2 py-1 text-center font-medium ${emp.variation >= 0 ? "text-green-700" : "text-red-700"
                                    }`}>
                                    {emp.variation >= 0 ? "+" : ""}{emp.variation.toFixed(1)}
                                </td>
                            </tr>
                        ))}

                        {/* Fila de totales */}
                        <tr className="bg-slate-100 border-t-[1px] border-slate-300 font-semibold">
                            <td className="text-left px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200">
                                TOTALES
                            </td>
                            <td className="px-2 py-1.5 border-r-[0.5px] border-slate-200"></td>
                            <td className="px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200 text-center">
                                {totalWWH.toFixed(1)}
                            </td>
                            <td className="px-2 py-1.5 text-slate-800 border-r-[0.5px] border-slate-200 text-center">
                                {totalHours.toFixed(1)}
                            </td>
                            <td className={`px-2 py-1.5 text-center font-bold ${totalVariation >= 0 ? "text-green-700" : "text-red-700"
                                }`}>
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
    const stats = {
        employees: new Set(data.flatMap(day => day.employees?.map(emp => emp.id) || [])).size,
        hours: data.reduce((total, day) => total + (day.employees?.reduce((dayTotal, emp) => dayTotal + emp.workShift.filter(w => w === "WORK").length * 0.25, 0) || 0), 0),
        days: data.length
    };

    return (
        <div
            ref={ref}
            className="font-sans bg-white"
        >
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0.2in; } 
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        image-rendering: -webkit-optimize-contrast;
                        image-rendering: crisp-edges;
                    }
                }
            `}</style>

            {/* Header de la Página */}
            <header className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">WorkSchedFlow</h1>
                <p className="text-sm text-slate-500">Gestión de equipos de trabajo</p>
            </header>

            {/* Contenido por Día */}
            {data.map((day) => (
                <section
                    key={day.id}
                    className="break-inside-avoid mb-6 border-[0.5px] border-slate-200 rounded-xl overflow-hidden"
                >
                    {/* Header del Día */}
                    <header className="p-1 bg-slate-50 border-b-[0.5px] border-slate-200 flex justify-between items-center">
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
                                {((day.employees?.reduce((total, emp) => total + emp.workShift.filter(w => w === "WORK").length, 0) || 0) * 0.25).toFixed(1)} horas
                            </div>
                            <div className="text-xs text-slate-500">Total del día</div>
                        </div>
                    </header>

                    {/* Grid de Turnos */}
                    <div>
                        <div
                            className="grid bg-slate-200 border-t-[0.2px] border-slate-200"
                            style={{
                                gridTemplateColumns: '1.5fr 2fr repeat(62, 0.5fr) 1fr',
                            }}
                        >
                            {/* Headers del Grid */}
                            <div className="bg-slate-200 px-1 py-0 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">Equipo</div>
                            <div className="bg-slate-200 px-1 py-0 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">Empleado</div>

                            <PrintableHeadRow />

                            <div className="bg-slate-200 p-0 text-[7pt] font-semibold text-slate-600 flex items-center justify-center gap-1">⏰</div>

                            {/* Filas de Empleados */}
                            {day.employees?.map((employee) => <PrintableEmployeeRow key={employee.id} employee={employee} />)}

                            {/* Fila de Distribución */}
                            <PrintableDistributionRow day={day} />
                        </div>
                    </div>
                </section>
            ))}

            {/* ✅ NUEVA SECCIÓN: Tabla de Resumen */}
            <PrintableSummaryTable data={data} />
        </div>
    );
});

PrintableRoster.displayName = 'PrintableRoster';