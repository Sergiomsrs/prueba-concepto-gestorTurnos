import { useMemo, memo, useContext, useState, useEffect, useCallback } from "react";
import { daysOfWeek } from "../../utils/data";
import { AppContext } from "../../context/AppContext";
import { splitIntoBlocksByIndex } from "../../utils/blockHours";

const calculateShiftDurationFromWorkShift = (workShift) => {
    if (!workShift) return 0;
    const workCount = workShift.filter((block) => block === "WORK").length;
    return (workCount * 15) / 60;
};

const getTotalShiftDuration = (employeeId, data) => {
    let totalMinutes = 0;
    for (const day of data) {
        const emp = day.employees.find((e) => e.id === employeeId);
        if (emp?.workShift) {
            const workCount = emp.workShift.filter((block) => block === "WORK").length;
            totalMinutes += workCount * 15;
        }
    }
    return totalMinutes / 60;
};

const indexToTime = (index) => {
    const totalMinutes = index * 15;
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const getShiftTimes = (workShift) => {
    if (!workShift) return null;
    const blocks = splitIntoBlocksByIndex(workShift);
    if (blocks.length === 0) return null;
    const [start, end] = blocks[0];
    return { min: indexToTime(start), max: indexToTime(end + 1) };
};

const formatTimeRange = (times) => {
    if (!times) return null;
    const start = times.min;
    const end = times.max;
    return `${start.substring(0, 5)}-${end.substring(0, 5)}`;
};

const getCellStyle = (hours, isHoliday) => {
    const base = "flex flex-col items-center justify-center text-xs rounded cursor-pointer transition-all hover:ring-2 hover:ring-blue-300";
    if (hours > 0) return `${base} bg-emerald-500 text-white font-semibold`;
    if (isHoliday) return `${base} bg-purple-50 text-purple-400 border border-purple-200`;
    return `${base} bg-slate-100 text-slate-400`;
};

// Modal de edición de turno
const ShiftEditModal = memo(({ employeeId, employeeName, dateId, dateLabel, currentTimes, currentData, onClose, onSaveShift, modifiedData, onSaveBoardChanges }) => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (currentTimes) {
            setStartTime(currentTimes.min.substring(0, 5));
            setEndTime(currentTimes.max.substring(0, 5));
        } else {
            setStartTime("08:00");
            setEndTime("16:00");
        }
    }, [currentTimes]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const hasPendingBoardChanges = modifiedData && modifiedData.length > 0;

    const handleSave = () => {
        if (!startTime || !endTime) return;
        if (hasPendingBoardChanges) {
            setShowConfirm(true);
            return;
        }
        onSaveShift({
            employeeId,
            date: dateId,
            startTime,
            endTime,
            currentData,
        });
        onClose();
    };

    const handleConfirmSaveAll = async () => {
        setShowConfirm(false);
        try {
            await onSaveBoardChanges();
        } catch (e) {
            console.error("Error guardando cambios de pizarra:", e);
        }
        onSaveShift({
            employeeId,
            date: dateId,
            startTime,
            endTime,
            currentData,
        });
        onClose();
    };

    const handleConfirmSaveShiftOnly = () => {
        setShowConfirm(false);
        onSaveShift({
            employeeId,
            date: dateId,
            startTime,
            endTime,
            currentData,
        });
        onClose();
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
    };

    const handleClear = () => {
        onSaveShift({
            employeeId,
            date: dateId,
            startTime: "00:00",
            endTime: "00:00",
            currentData,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-5 w-72">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{employeeName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">{dateLabel}</p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Entrada</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            step="900"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Salida</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            step="900"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-5">
                    <button
                        onClick={handleSave}
                        className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Guardar
                    </button>
                    {currentTimes && (
                        <button
                            onClick={handleClear}
                            className="px-3 py-2 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                            title="Limpiar turno"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {showConfirm && (
                <div className="absolute inset-0 z-60 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30" onClick={handleConfirmCancel} />
                    <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-5 w-80">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-amber-500 text-lg">⚠️</span>
                            <h4 className="text-sm font-bold text-slate-900">Cambios pendientes en pizarra</h4>
                        </div>
                        <p className="text-xs text-slate-600 mb-5">
                            Tienes <span className="font-bold text-amber-600">{modifiedData.length} cambio{modifiedData.length > 1 ? 's' : ''}</span> sin guardar en la pizarra. ¿Deseas guardarlos también?
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleConfirmSaveAll}
                                className="w-full px-3 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                Sí, guardar todo
                            </button>
                            <button
                                onClick={handleConfirmSaveShiftOnly}
                                className="w-full px-3 py-2 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            >
                                No, solo este turno
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="w-full px-3 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

ShiftEditModal.displayName = 'ShiftEditModal';

// Fila de empleado
const EmployeeRow = memo(
    ({ employeeId, employeeName, employeeLastName, teamWork, dataToUse, dataForCalculations, holidayDates, selectedOption, onCellClick }) => {

        const wwh = useMemo(() => {
            const sourceData = dataForCalculations || dataToUse;
            let total = 0;
            for (const day of sourceData) {
                if (day.holiday) continue;
                const emp = day.employees.find((e) => e.id === employeeId);
                if (emp?.pto == true) continue;
                if (emp?.wwh) total += emp.wwh / 7;
            }
            return Math.round((total * 2) / 2);
        }, [dataToUse, dataForCalculations, employeeId, holidayDates]);

        const totalShiftDuration = useMemo(
            () => getTotalShiftDuration(employeeId, dataForCalculations || dataToUse),
            [employeeId, dataToUse, dataForCalculations]
        );

        const variation = wwh - totalShiftDuration;
        const fullName = `${employeeName} ${employeeLastName}`;

        return (
            <tr className="border-b border-slate-200 hover:bg-slate-50">
                {/* COLUMNA EMPLEADO */}
                <td className="pl-4 py-2.5 bg-white sticky left-0 z-10 border-r border-slate-200">
                    <div className="flex flex-col min-w-[150px] max-w-[250px]">
                        <span
                            className="whitespace-nowrap overflow-hidden text-ellipsis"
                            title={fullName}
                        >
                            {fullName}
                        </span>
                    </div>
                </td>

                {/* ESTADÍSTICAS */}
                <td className="px-3 py-2.5 text-sm text-slate-700 text-center border-r border-slate-200">
                    {wwh}
                </td>
                <td className="px-3 py-2.5 text-sm font-bold text-slate-900 text-center border-r border-slate-200">
                    {totalShiftDuration.toFixed(2)}
                </td>
                <td className={`px-3 py-2.5 text-sm font-bold text-center border-r-2 border-slate-300 ${variation >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {variation > 0 ? '+' : ''}{variation.toFixed(2)}
                </td>

                {/* CALENDARIO */}
                {dataToUse.map((day) => {
                    const emp = day.employees.find((e) => e.id === employeeId);
                    const hours = emp?.workShift ? calculateShiftDurationFromWorkShift(emp.workShift) : 0;
                    const isHoliday = day.holiday;
                    const shiftTimes = emp?.workShift ? getShiftTimes(emp.workShift) : null;
                    const timeRange = formatTimeRange(shiftTimes);

                    return (
                        <td key={day.id} className="p-0.5 w-16 h-14">
                            <div
                                className={`w-full h-full flex flex-col items-center justify-center text-[10px] rounded ${getCellStyle(hours, isHoliday)}`}
                                title={`${day.day}: ${hours}h${timeRange ? ` (${timeRange})` : ''}`}
                                onClick={(e) => onCellClick(employeeId, employeeName, day.id, day.day, e.currentTarget, shiftTimes)}
                            >
                                {hours > 0 ? (
                                    <>
                                        <span className="text-xs font-bold leading-tight">{hours}h</span>
                                        {timeRange && (
                                            <span className="text-[9px] leading-tight opacity-90">{timeRange}</span>
                                        )}
                                    </>
                                ) : isHoliday ? '🎉' : ''}
                            </div>
                        </td>
                    );
                })}
            </tr>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.employeeId === nextProps.employeeId &&
            prevProps.employeeName === nextProps.employeeName &&
            prevProps.employeeLastName === nextProps.employeeLastName &&
            prevProps.teamWork === nextProps.teamWork &&
            prevProps.dataToUse === nextProps.dataToUse &&
            prevProps.dataForCalculations === nextProps.dataForCalculations &&
            prevProps.holidayDates === nextProps.holidayDates &&
            prevProps.selectedOption === nextProps.selectedOption &&
            prevProps.onCellClick === nextProps.onCellClick
        );
    }
);

EmployeeRow.displayName = 'EmployeeRow';

// Fila footer
const DailySummaryRow = memo(({ dataToUse, dataForCalculations, visibleEmployees, holidayDates, selectedOption }) => {
    const dailyTotals = useMemo(() => {
        return dataToUse.map((day) => {
            let totalMinutes = 0;
            for (const emp of day.employees) {
                if (emp?.workShift) {
                    const workCount = emp.workShift.filter((block) => block === "WORK").length;
                    totalMinutes += workCount * 15;
                }
            }
            return +(totalMinutes / 60).toFixed(0);
        });
    }, [dataToUse]);

    const columnTotals = useMemo(() => {
        let totalWWH = 0;
        let totalHours = 0;

        if (!visibleEmployees || visibleEmployees.length === 0) return { wwh: 0, total: '0.0', variation: '0.0' };

        const sourceData = dataForCalculations || dataToUse;

        for (const [id, employeeInfo] of visibleEmployees) {
            let wwhProporcionalEmpleado = 0;

            for (const day of sourceData) {
                if (day.holiday) continue;
                const emp = day.employees?.find((e) => Number(e.id) === Number(id));
                if (emp && emp.pto !== true) {
                    const diaria = Number(emp.wwh || 0) / 7;
                    wwhProporcionalEmpleado += diaria;
                }
            }

            totalWWH += wwhProporcionalEmpleado;
            totalHours += getTotalShiftDuration(id, sourceData);
        }

        return {
            wwh: Math.round(totalWWH),
            total: totalHours.toFixed(2),
            variation: (totalWWH - totalHours).toFixed(2)
        };
    }, [dataToUse, dataForCalculations, visibleEmployees]);

    return (
        <tr className="bg-slate-50 border-t-2 border-slate-300">
            <td className="pl-4 py-3 sticky left-0 z-10 bg-slate-50 border-r border-slate-200">
                <div className="font-bold text-sm text-slate-900">TOTAL GENERAL</div>
            </td>

            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.wwh}
            </td>
            <td className="px-3 py-3 text-sm font-bold text-slate-900 text-center bg-slate-100 border-r border-slate-200">
                {columnTotals.total}
            </td>
            <td className={`px-3 py-3 text-sm font-bold text-center bg-slate-100 border-r-2 border-slate-300 ${parseFloat(columnTotals.variation) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {parseFloat(columnTotals.variation) > 0 ? '+' : ''}{columnTotals.variation}
            </td>

            {dailyTotals.map((hours, i) => (
                <td key={i} className="p-0.5 w-16">
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-900 rounded">
                        {hours}
                    </div>
                </td>
            ))}
        </tr>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.dataToUse === nextProps.dataToUse &&
        prevProps.dataForCalculations === nextProps.dataForCalculations &&
        prevProps.visibleEmployees === nextProps.visibleEmployees &&
        prevProps.holidayDates === nextProps.holidayDates
    );
});

DailySummaryRow.displayName = 'DailySummaryRow';

// Componente principal
export const RosterRangeSummary = memo(({ data, originalData, currentData, onSaveShift, modifiedData, onSaveBoardChanges }) => {
    const { selectedOption, holidayDates } = useContext(AppContext);

    const [activeCell, setActiveCell] = useState(null);

    const dataForCalculations = originalData || data;

    const allEmployeesForCalculations = useMemo(() => {
        const employeeMap = new Map();
        for (const day of dataForCalculations) {
            for (const emp of day.employees) {
                if (!employeeMap.has(emp.id)) {
                    employeeMap.set(emp.id, {
                        name: emp.name,
                        lastName: emp.lastName,
                        teamWork: emp.teamWork,
                    });
                }
            }
        }
        return employeeMap;
    }, [dataForCalculations]);

    const visibleEmployees = useMemo(() => {
        const visibleMap = new Map();
        for (const day of dataForCalculations) {
            for (const emp of day.employees) {
                if (!visibleMap.has(emp.id)) {
                    visibleMap.set(emp.id, {
                        name: emp.name,
                        lastName: emp.lastName,
                        teamWork: emp.teamWork,
                    });
                }
            }
        }
        const visibleArray = Array.from(visibleMap.entries());
        if (selectedOption === "todos") return visibleArray;
        return visibleArray.filter(([, { teamWork }]) => teamWork === selectedOption);
    }, [dataForCalculations, selectedOption]);

    const dayHeaders = useMemo(() => {
        return data.map((item) => {
            const dayName = item.day?.charAt(0).toUpperCase() || daysOfWeek[item.id]?.charAt(0);
            const dayNumber = typeof item.id === "string" ? item.id.slice(8, 10) : "";
            const isWeekend = item.day === 'sábado' || item.day === 'domingo';
            return { id: item.id, initial: dayName, dayNumber, isWeekend };
        });
    }, [data]);

    const handleCellClick = useCallback((employeeId, employeeName, dateId, dayName, cellElement, currentTimes) => {
        const dateLabel = new Date(dateId + 'T12:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
        setActiveCell({
            employeeId,
            employeeName,
            dateId,
            dateLabel,
            currentTimes,
        });
    }, []);

    const handleClosePopover = useCallback(() => {
        setActiveCell(null);
    }, []);

    const handleSaveShift = useCallback((params) => {
        if (onSaveShift) {
            onSaveShift(params);
        }
    }, [onSaveShift]);

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 relative">
            <table className="w-auto border-collapse bg-white">
                <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-300">
                        <th className="text-left pl-4 py-3 sticky left-0 bg-slate-50 z-20 border-r border-slate-200 min-w-[150px] max-w-[250px] whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                Empleado
                            </div>
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Weekly Working Hours">
                            WWH
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r border-slate-200" title="Total Horas">
                            Total
                        </th>
                        <th className="px-3 py-3 text-xs font-bold text-slate-700 uppercase border-r-2 border-slate-300" title="Variación">
                            Var
                        </th>
                        {dayHeaders.map((d) => (
                            <th
                                key={d.id}
                                className={`p-2 w-16 text-center ${d.isWeekend ? 'bg-slate-100' : 'bg-slate-50'}`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-semibold text-slate-700">{d.initial}</span>
                                    <span className="text-xs font-bold text-slate-900 mt-0.5">{d.dayNumber}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {visibleEmployees.map(([id, { name, lastName, teamWork }]) => (
                        <EmployeeRow
                            key={id}
                            employeeId={id}
                            employeeName={name}
                            employeeLastName={lastName}
                            teamWork={teamWork}
                            dataToUse={data}
                            dataForCalculations={dataForCalculations}
                            holidayDates={holidayDates}
                            selectedOption={selectedOption}
                            onCellClick={handleCellClick}
                        />
                    ))}
                    <DailySummaryRow
                        dataToUse={data}
                        dataForCalculations={dataForCalculations}
                        visibleEmployees={visibleEmployees}
                        holidayDates={holidayDates}
                        selectedOption={selectedOption}
                    />
                </tbody>
            </table>

            {activeCell && (
                <ShiftEditModal
                    employeeId={activeCell.employeeId}
                    employeeName={activeCell.employeeName}
                    dateId={activeCell.dateId}
                    dateLabel={activeCell.dateLabel}
                    currentTimes={activeCell.currentTimes}
                    currentData={currentData}
                    onClose={handleClosePopover}
                    onSaveShift={handleSaveShift}
                    modifiedData={modifiedData}
                    onSaveBoardChanges={onSaveBoardChanges}
                />
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.originalData === nextProps.originalData && prevProps.currentData === nextProps.currentData && prevProps.onSaveShift === nextProps.onSaveShift && prevProps.modifiedData === nextProps.modifiedData && prevProps.onSaveBoardChanges === nextProps.onSaveBoardChanges;
});

RosterRangeSummary.displayName = 'RosterRangeSummary';
