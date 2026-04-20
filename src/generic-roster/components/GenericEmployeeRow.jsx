// generic/components/GenericEmployeeRow.jsx

import { memo, useMemo, useCallback } from "react";
import { useEmployeeInteractions } from "../../roster/hooks/useEmployeeInteractions";
import { selectColor } from "../../utils/function";

const getHighestNonZeroIndex = (array) => {
    if (!array) return -1;
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === "WORK") return i;
    }
    return -1;
};

export const GenericEmployeeRow = memo(
    ({
        employee,
        dayIndex,
        employeeIndex,
        dispatch,
        numRows,
        numDays,
        inputRefsMatrix,
        previousEmployee,
        rangeConfig,
    }) => {
        const {
            inputRefs,
            handleMouseDown,
            handleMouseEnter,
            handleMouseUp,
            handleKeyDown,
        } = useEmployeeInteractions({
            employee,
            dayIndex,
            employeeIndex,
            numRows,
            numDays,
            dispatch,
            inputRefsMatrix,
        });

        const disabledLimit = useMemo(() => {
            if (!previousEmployee?.workShift) return -1;
            const highestIndex = getHighestNonZeroIndex(previousEmployee.workShift);
            return highestIndex >= 48 ? highestIndex - 48 : -1;
        }, [previousEmployee?.workShift]);

        const isIndexDisabled = useCallback(
            (index) => disabledLimit >= 0 && index <= disabledLimit,
            [disabledLimit]
        );

        const totalHours = useMemo(
            () => (employee.workShift.filter((w) => w === "WORK").length * 15) / 60,
            [employee.workShift]
        );

        const hourLabelsByIndex = useMemo(() => {
            const labels = new Map();
            const shift = employee.workShift || [];
            let start = null;

            const indexToTime = (index) => {
                const totalMinutes = index * 15;
                const hh = Math.floor(totalMinutes / 60);
                const mm = totalMinutes % 60;
                return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
            };

            // Si hay rangeConfig, solo procesar índices dentro del visible range
            const startIdx = rangeConfig?.startIndex ?? 0;
            const endIdx = rangeConfig?.endIndex ?? shift.length;

            for (let i = startIdx; i < endIdx && i < shift.length; i++) {
                const isWork = shift[i] === "WORK";
                if (isWork && start === null) start = i;

                const closesSegment =
                    start !== null && (!isWork || i === endIdx - 1 || i === shift.length - 1);

                if (closesSegment) {
                    const end = isWork ? i : i - 1;
                    const segmentLength = end - start + 1;

                    if (segmentLength >= 3) {
                        labels.set(start, { type: "start", text: indexToTime(start) });
                        labels.set(end, { type: "end", text: indexToTime(end + 1) });
                    }
                    start = null;
                }
            }

            return labels;
        }, [employee.workShift, rangeConfig?.startIndex, rangeConfig?.endIndex]);

        // ── Sin labels de hora inicio/fin para genéricos (más limpio visualmente)
        // Si en el futuro las necesitas, es copiar el useMemo de EmployeeRow

        const toggleHour = useCallback((hourIndex) => {
            const currentValue = employee.workShift[hourIndex];
            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) return;

            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex },
            });
        }, [employee.workShift, isIndexDisabled, dispatch, dayIndex, employeeIndex]);

        const handleCellMouseDownWithLogic = useCallback((hourIndex, event) => {
            const currentValue = employee.workShift[hourIndex];

            if (currentValue === "PTO" || isIndexDisabled(hourIndex)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (currentValue === "CONFLICT") {
                event.preventDefault();
                event.stopPropagation();
                toggleHour(hourIndex);
                return;
            }

            handleMouseDown(hourIndex);
        }, [employee.workShift, isIndexDisabled, toggleHour, handleMouseDown]);

        const getCursorClass = (isDisabled, value) => {
            if (isDisabled || value === "PTO") return "cursor-not-allowed opacity-30";
            if (value === "CONFLICT") return "cursor-pointer opacity-90";
            return "cursor-pointer";
        };

        const getBackgroundClass = (value) => {
            if (value === "PTO") return "bg-red-400";
            if (value === "Null") return "bg-slate-50";
            if (value === "CONFLICT") return "bg-amber-400 animate-pulse";
            return "";
        };

        const outOfRangeIndicator = useMemo(() => {
            const shift = employee.workShift;
            const { startIndex, endIndex } = rangeConfig; // los índices absolutos del rango visible

            const hasBefore = shift.slice(0, startIndex).some(v => v === "WORK");
            const hasAfter = shift.slice(endIndex + 1).some(v => v === "WORK");

            return { hasBefore, hasAfter };
        }, [employee.workShift, rangeConfig.startIndex, rangeConfig.endIndex]);


        return (
            <>
                {/* Sección / teamWork */}
                <div className="bg-white px-3 py-0 text-sm font-medium text-gray-800 border-r flex items-center">
                    <span className="truncate">{employee.teamWork}</span>
                </div>

                {/* Nombre del turno — sin botón modal, sin lastName */}
                <div className={`bg-white px-3 py-0 text-sm text-gray-700 flex items-center overflow-visible
    ${outOfRangeIndicator.hasBefore ? 'relative before:absolute before:z-10 before:right-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-amber-400 before:content-[""]' : ''}
`}>
                    <span className="truncate">
                        {employee.name}
                    </span>
                </div>

                {/* Celdas de workShift */}
                {employee.workShift.map((value, hourIndex) => {
                    // Solo renderear si está dentro del rango visible
                    if (rangeConfig && (hourIndex < rangeConfig.startIndex || hourIndex >= rangeConfig.endIndex)) {
                        return null;
                    }
                    const disabled = isIndexDisabled(hourIndex) || value === "PTO";
                    const cellBgClass = disabled ? "bg-red-200/50" : "bg-white";
                    const isHourStart = hourIndex % 4 === 0;
                    const hourLabel = hourLabelsByIndex.get(hourIndex);

                    return (
                        <div
                            key={hourIndex}
                            className={`${cellBgClass} flex items-center justify-center w-5 h-5 px-0 py-0 mx-0 my-1 relative`}
                            onMouseUp={handleMouseUp}
                        >
                            {/* Tick de hora en punto */}
                            {isHourStart && (
                                <div
                                    className="absolute w-[1px] bg-gray-200 z-10 pointer-events-none"
                                    style={{ left: "-0.5px", height: "30px" }}
                                />
                            )}

                            <input
                                ref={(el) => {
                                    inputRefs.current[hourIndex] = el;
                                    if (!inputRefsMatrix.current[dayIndex])
                                        inputRefsMatrix.current[dayIndex] = [];
                                    if (!inputRefsMatrix.current[dayIndex][employeeIndex])
                                        inputRefsMatrix.current[dayIndex][employeeIndex] = [];
                                    inputRefsMatrix.current[dayIndex][employeeIndex][hourIndex] = el;
                                }}
                                type="checkbox"
                                checked={value !== "Null" && value !== "PTO"}
                                onMouseDown={(e) => handleCellMouseDownWithLogic(hourIndex, e)}
                                onMouseEnter={() => handleMouseEnter(hourIndex)}
                                onChange={() => { }}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        toggleHour(hourIndex);
                                    } else {
                                        handleKeyDown(e, hourIndex);
                                    }
                                }}
                                disabled={disabled}
                                className={`
                w-5 h-5 m-0 p-0 appearance-none border-none
                ${getCursorClass(isIndexDisabled(hourIndex), value)}
                ${getBackgroundClass(value)}
                ${value === "WORK" ? "border-t-2 border-b-2 border-neutral-200" : ""}
                focus:ring-2 focus:ring-indigo-400
                mx-auto my-1
                shadow-sm
            `}
                                style={value === "WORK" ? { backgroundColor: selectColor(employee.teamWork) } : {}}
                            />

                            {/* ← AQUÍ, justo después del input */}
                            {hourLabel && (
                                <span
                                    className={`
                    absolute z-20 bottom-0 text-[9px] font-semibold leading-none
                    pointer-events-none select-none
                    px-0.5 rounded-sm
                    ${hourLabel.type === "start" ? "left-0" : "right-0"}
                `}
                                    style={{
                                        background: 'rgba(0,0,0,0.28)',
                                        color: 'white',
                                        backdropFilter: 'blur(2px)',
                                        lineHeight: '12px',
                                    }}
                                >
                                    {hourLabel.text}
                                </span>
                            )}

                        </div>
                    );
                })}

                {/* Total horas */}
                <div className={`bg-white px-3 py-0 text-sm font-medium text-gray-700 border-l text-center
    ${outOfRangeIndicator.hasAfter ? 'relative before:absolute before:left-[-2px] before:top-0 before:h-full before:w-[2px] before:bg-amber-400' : ''}
`}>
                    {totalHours.toFixed(2)}
                </div>
            </>
        );
    }
);

GenericEmployeeRow.displayName = "GenericEmployeeRow";