import React from "react";
import { selectColor } from "../../utils/function";

// --- COMPONENTES INTERNOS CON ESTILO TAILWIND SIMPLIFICADO ---

/**
 * Encabezado de la cuadrícula con las horas (cada 15 minutos).
 */
const PrintableHeadRow = () => {
    const hours = Array.from({ length: 62 }, (_, i) => {
        const startHour = 7;
        const totalMinutes = startHour * 60 + (i * 15);
        const hour = Math.floor(totalMinutes / 60);
        return hour.toString().padStart(2, '0');
    });

    return (
        <>
            {hours.map((hour, i) => {
                const isHourStart = i % 4 === 0;

                // SOLO MANTENEMOS EL BORDE DE LA HORA EXACTA
                const borderClass = isHourStart
                    ? 'border-l border-slate-500'
                    : 'border-l-0';

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 h-6 flex items-center justify-center 
                            text-[5pt] relative
                            ${isHourStart ? 'font-bold text-slate-700' : 'font-normal text-slate-400'}
                            ${borderClass}
                        `}
                    >
                        {isHourStart ? hour : ""}
                    </div>
                );
            })}
        </>
    );
};

// ---------------------------------------------------------------- //

/**
 * Fila individual de un empleado.
 */
const PrintableEmployeeRow = ({ employee }) => {
    const totalHours = (employee.workShift.filter((w) => w === "WORK").length * 15) / 60;

    const getCellClasses = (value, isHourStart) => {
        // ✅ AJUSTADO: Altura de celda de turno reducida a h-3.5 (14px)
        const baseClasses = `h-3.5 flex items-center justify-center`;

        // SOLO MANTENEMOS EL BORDE DE LA HORA EXACTA
        const borderLeftClass = isHourStart
            ? 'border-l border-slate-500'
            : 'border-l-0';

        let backgroundClass = 'bg-slate-50';

        if (value === "PTO") {
            backgroundClass = 'bg-red-200';
        } else if (value === "CONFLICT") {
            backgroundClass = 'bg-amber-400';
        } else if (value === "WORK") {
            backgroundClass = selectColor(employee.teamWork).replace('bg-', 'bg-');
        }

        return `${baseClasses} ${backgroundClass} ${borderLeftClass}`;
    };

    return (
        // AÑADIMOS UN ÚNICO BORDE INFERIOR A LA FILA COMPLETA
        <div className="contents border-b border-slate-200">
            {/* Columna Equipo */}
            {/* ✅ AJUSTADO: Padding vertical (py) minimizado a [1px] */}
            <div className="bg-white py-[1px] px-1.5 text-[6pt] font-semibold text-slate-800 border-r flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.teamWork}
            </div>
            {/* Columna Empleado */}
            {/* ✅ AJUSTADO: Padding vertical (py) minimizado a [1px] */}
            <div className="bg-white py-[1px] px-1.5 text-[5.5pt] text-slate-600 border-r flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                {employee.name} {employee.lastName}
            </div>

            {/* Celdas de horario */}
            {employee.workShift.map((value, hourIndex) => (
                <div key={hourIndex} className={getCellClasses(value, hourIndex % 4 === 0)}>
                    {value === "PTO" && <span className="text-red-800 text-[5.5pt] font-bold">×</span>}
                </div>
            ))}

            {/* Columna Total */}
            {/* ✅ AJUSTADO: Padding vertical (py) minimizado a [1px] */}
            <div className="bg-white py-[1px] px-1 text-[6pt] font-semibold text-slate-800 border-l flex items-center justify-center">
                {totalHours.toFixed(1)}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------- //

/**
 * Fila de distribución de empleados por franja horaria.
 */
const PrintableDistributionRow = ({ day }) => {
    const distributionData = Array.from({ length: 62 }, (_, i) => day.employees?.reduce((acc, emp) => acc + (emp.workShift[i] === "WORK" ? 1 : 0), 0) || 0);

    return (
        <>
            {/* Cabecera de Distribución (span 2) */}
            <div className="col-span-2 bg-slate-100 px-1.5 py-1 text-[5.5pt] font-semibold text-slate-600 border-t-2 border-slate-500 border-b-2 border-b-slate-500 flex items-center">
                Distribución
            </div>

            {distributionData.map((count, i) => {
                // SOLO MANTENEMOS EL BORDE DE LA HORA EXACTA
                const borderLeftClass = i % 4 === 0
                    ? 'border-l border-slate-500'
                    : 'border-l-0';

                return (
                    <div
                        key={i}
                        className={`
                            bg-slate-100 border-t-2 border-slate-500 border-b-2 border-b-slate-500
                            flex items-center justify-center text-[5.5pt] font-bold 
                            ${borderLeftClass}
                            ${count > 0 ? 'text-slate-800' : 'text-transparent'}
                        `}
                    >
                        {count}
                    </div>
                );
            })}
            {/* Celda de relleno para la columna de Total */}
            <div className="bg-slate-100 border-t-2 border-slate-500 border-b-2 border-b-slate-500 border-l border-slate-200"></div>
        </>
    );
};

// ---------------------------------------------------------------- //

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
            className="font-sans bg-white p-4"
        >
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0.5in; }
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
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Roster Board</h1>
                <p className="text-sm text-slate-500">Gestión de equipos de trabajo</p>
            </header>

            {/* Contenido por Día */}
            {data.map((day) => (
                <section
                    key={day.id}
                    className="break-inside-avoid mb-6 border border-slate-200 rounded-xl overflow-hidden shadow-lg"
                >
                    {/* Header del Día */}
                    <header className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
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
                            className="grid bg-slate-400 border-t border-slate-200"
                            style={{
                                gridTemplateColumns: '1.5fr 2fr repeat(62, 0.5fr) 1fr',
                            }}
                        >
                            {/* Headers del Grid */}
                            {/* Nota: Hemos dejado el py-2 (8px) aquí para que la cabecera del grid se distinga mejor. */}
                            <div className="bg-slate-100 px-1 py-2 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">👥 Equipo</div>
                            <div className="bg-slate-100 px-1 py-2 text-[6pt] font-semibold text-slate-600 flex items-center gap-1">👤 Empleado</div>

                            <PrintableHeadRow />

                            <div className="bg-slate-100 p-2 text-[7pt] font-semibold text-slate-600 flex items-center justify-center gap-1">⏰</div>

                            {/* Filas de Empleados */}
                            {day.employees?.map((employee) => <PrintableEmployeeRow key={employee.id} employee={employee} />)}

                            {/* Fila de Distribución */}
                            <PrintableDistributionRow day={day} />
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
});

PrintableRoster.displayName = 'PrintableRoster';