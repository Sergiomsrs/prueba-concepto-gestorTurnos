import { useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EmployeeRow } from "./EmployeeRow";

/**
 * VirtualizedEmployeeList
 *
 * Renderiza únicamente las filas de empleados visibles en pantalla.
 * Sustituye al .map() directo en RosterPage para días con muchos empleados.
 *
 * Props:
 *  - employees          : array de empleados del día (ya filtrados)
 *  - dayMapping         : { dayIndex, employeeMap } — igual que antes
 *  - filteredData       : array completo de días filtrados (para previousEmployee)
 *  - realDayIndex       : índice real del día en filteredData
 *  - gridColumns        : string CSS para gridTemplateColumns
 *  - inputRefsMatrix    : ref compartida para navegación por teclado
 *  - dispatch           : dispatcher del reducer
 *  - ROW_HEIGHT         : alto en px de cada fila (default 28). Debe coincidir
 *                         con el alto real de EmployeeRow (h-5 + my-1 = 28px).
 */
export const VirtualizedEmployeeList = ({
    employees,
    dayMapping,
    filteredData,
    realDayIndex,
    gridColumns,
    inputRefsMatrix,
    dispatch,
    ROW_HEIGHT = 28,
}) => {
    const parentRef = useRef(null);

    // Número de filas a pre-renderizar fuera del viewport (buffer)
    const OVERSCAN = 5;

    const rowVirtualizer = useVirtualizer({
        count: employees.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
    });

    const totalHeight = rowVirtualizer.getTotalSize();
    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        /*
         * Contenedor con scroll vertical. La altura máxima limita cuántos px
         * ocupa la lista antes de activar el scroll interno.
         * Ajusta maxHeight según tu diseño (ej. 600px para ~21 empleados).
         */
        <div
            ref={parentRef}
            style={{
                overflowY: "auto",
                maxHeight: `${ROW_HEIGHT * 20}px`, // muestra ~20 filas, luego scroll
                position: "relative",
            }}
        >
            {/* Espaciador: reserva el alto total para que el scrollbar sea preciso */}
            <div style={{ height: totalHeight, position: "relative" }}>
                {virtualItems.map((virtualRow) => {
                    const employee = employees[virtualRow.index];
                    const originalEmployeeIndex = dayMapping.employeeMap.get(employee.id);

                    if (originalEmployeeIndex === undefined) return null;

                    return (
                        <div
                            key={employee.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                transform: `translateY(${virtualRow.start}px)`,
                                width: "100%",
                                height: `${ROW_HEIGHT}px`,
                            }}
                        >
                            <div
                                className="grid bg-slate-200 min-w-max transition-all duration-200"
                                style={{ gridTemplateColumns: gridColumns }}
                            >
                                <EmployeeRow
                                    employee={employee}
                                    dayIndex={dayMapping.dayIndex}
                                    employeeIndex={originalEmployeeIndex}
                                    numRows={employees.length}
                                    numDays={filteredData.length}
                                    inputRefsMatrix={inputRefsMatrix}
                                    dispatch={dispatch}
                                    previousEmployee={
                                        filteredData[realDayIndex - 1]?.employees?.find(
                                            (e) => e.id === employee.id
                                        )
                                    }
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
