import { useEffect, useReducer, useMemo, useRef, useState, useContext, useCallback } from "react";
import { DistributionRow } from "@/roster/components/DistributionRow";
import { HeadRow } from "@/roster/components/HeadRow";
import { GenericEmployeeRow } from "./GenericEmployeeRow";
import { OptionsPicker } from "@/genericShifts/components/OptionsPicker";
import { AppContext } from "@/context/AppContext";
import { useCyclesGenerator } from "@/Hooks/useCyclesGenerator";
import { rosterReducer } from "@/roster/reducers/rosterReducer";
import { RosterRangeSummary } from "@/roster/components/RosterRangeSummary";
import { getVisibleRange, HOUR_RANGE_PRESETS } from "@/utils/rangeCalculator";

export const GenericRosterPage = () => {
    const [data, dispatch] = useReducer(rosterReducer, []);
    const inputRefsMatrix = useRef([]);

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];


    const { selectedOption, setSelectedOption, filters, setFilters } = useContext(AppContext);

    const {
        data: cycleData,
        ciclo,
        setCiclo,
        roles,
        handleGetCycle,
        handleSaveModifiedCycle,
    } = useCyclesGenerator();

    const [showFullDistribution, setShowFullDistribution] = useState(false);
    const printableRef = useRef(null);

    // Sync hook data → reducer
    useEffect(() => {
        if (cycleData.length > 0) {
            dispatch({ type: "SET_ROSTER", payload: cycleData });
        }
    }, [cycleData]);

    // Equipos disponibles
    const availableTeams = useMemo(() => {
        const teams = new Set();
        data.forEach(day => {
            day.employees?.forEach(emp => {
                if (emp.teamWork) teams.add(emp.teamWork);
            });
        });
        return Array.from(teams).sort();
    }, [data]);

    // ✅ Cachear el cálculo del rango visible para el grid (con validación de seguridad)
    const visibleSlots = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        const range = getVisibleRange(displayRange.startHour, displayRange.endHour);
        return range.visibleSlots;
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    // ✅ NUEVO: Cachear el rango visible completo (startIndex, endIndex, visibleSlots)
    const rangeConfig = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        return getVisibleRange(displayRange.startHour, displayRange.endHour);
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    // ✅ Grid layout dinámico basado en visibleSlots
    const gridColumns = useMemo(() => {
        return `120px 150px repeat(${visibleSlots}, 20px) 80px`;
    }, [visibleSlots]);

    // ✅ Memoizar opciones del select (evita re-generar en cada render)
    const selectOptions = useMemo(() => {
        return HOUR_RANGE_PRESETS.map(preset => (
            <option key={preset.id} value={`${preset.startHour}-${preset.endHour}`}>
                {preset.label}
            </option>
        ));
    }, []); // HOUR_RANGE_PRESETS es constante, nunca cambia

    // ✅ Memoizar valor del select
    const selectValue = useMemo(() => {
        return `${(filters?.displayHourRange?.startHour ?? 7)}-${(filters?.displayHourRange?.endHour ?? 22.5)}`;
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    // Index mapping (igual que RosterPage)
    const indexMapping = useMemo(() => {
        const mapping = new Map();
        data.forEach((day, dayIndex) => {
            const dayMap = new Map();
            day.employees?.forEach((emp, empIndex) => {
                dayMap.set(emp.id, empIndex);
            });
            mapping.set(day.id, { dayIndex, employeeMap: dayMap });
        });
        return mapping;
    }, [data]);

    // Filtrado por equipo (selectedOption viene del contexto, igual que antes)
    const filteredData = useMemo(() => {
        if (!data.length) return [];
        if (selectedOption === "todos") return data;

        return data.map(day => ({
            ...day,
            employees: day.employees?.filter(emp => emp.teamWork === selectedOption) || []
        }));
    }, [data, selectedOption]);

    // Cambios pendientes para guardar
    const modifiedData = useMemo(() => {
        const result = [];
        for (let dayIndex = 1; dayIndex < data.length; dayIndex++) {
            const day = data[dayIndex];
            for (const emp of day.employees || []) {
                if (emp.isModified) {
                    result.push({
                        employeeId: emp.id,
                        date: day.id,
                        hours: emp.workShift,
                        shiftDuration: emp.shiftDuration,
                    });
                }
            }
        }
        return result;
    }, [data]);

    // Stats
    const stats = useMemo(() => {
        const uniqueEmployees = new Set();
        let totalHours = 0;
        for (let i = 1; i < filteredData.length; i++) {
            const day = filteredData[i];
            if (!day.employees?.length) continue;
            for (const emp of day.employees) {
                uniqueEmployees.add(emp.id);
                for (const shift of emp.workShift) {
                    if (shift === "WORK") totalHours += 0.25;
                }
            }
        }
        return {
            employees: uniqueEmployees.size,
            hours: totalHours,
            days: Math.max(0, filteredData.length - 1)
        };
    }, [filteredData]);

    // ✅ Callbacks memoizados
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, [setFilters]);

    // ✅ Limpiar filtros (incluyendo displayHourRange)
    const clearFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            displayHourRange: { startHour: 7, endHour: 22.5 },
        }));
    }, [setFilters]);

    const handleGetData = () => {
        if (ciclo) handleGetCycle(ciclo);
    };

    const handleSaveData = async () => {
        try {
            // ✅ Solo guardar cambios modificados
            await handleSaveModifiedCycle(modifiedData, ciclo);
            await handleGetCycle(ciclo);
            console.log("✅ Cambios guardados y ciclo recargado");
        } catch (error) {
            console.error("❌ Error al guardar:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">

            {/* ── HEADER ── */}
            <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-[1920px] mx-auto">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                        <div className="flex items-center space-x-3">
                            <div>
                                <img src="./logo-navegador.webp" alt="Logo" width="48" height="48" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Generic Roster</h1>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Gestión de turnos genéricos</p>
                            </div>
                        </div>

                        {/* Stats Desktop */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                                <span>👥</span>
                                <span className="text-sm font-medium text-slate-700">{stats.employees} Turnos</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                                <span>⏰</span>
                                <span className="text-sm font-medium text-slate-700">{stats.hours.toFixed(1)} Horas</span>
                            </div>
                            {ciclo && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-lg">
                                    <span>🔄</span>
                                    <span className="text-sm font-medium text-blue-700">Ciclo {ciclo}</span>
                                </div>
                            )}
                            {modifiedData.length > 0 && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-amber-100 rounded-lg">
                                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-amber-700">{modifiedData.length} Cambios</span>
                                </div>
                            )}

                        </div>


                    </div>

                    {/* Barra de controles */}
                    <div className="border-t border-slate-200 bg-slate-50">
                        <div className="px-4 sm:px-6 py-4">
                            <div className="flex flex-wrap gap-4 items-end">

                                {/* Selector de Ciclo */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Ciclo
                                    </label>
                                    <OptionsPicker value={ciclo} onChange={setCiclo} />
                                </div>

                                {/* Filtro por Sección */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Sección
                                    </label>
                                    <select
                                        value={selectedOption}
                                        onChange={e => setSelectedOption(e.target.value)}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="todos">Todas las secciones</option>
                                        {availableTeams.map(team => (
                                            <option key={team} value={team}>{team}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ✅ NUEVO: Rango de Horas */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Rango Horario
                                    </label>
                                    <select
                                        value={selectValue}
                                        onChange={(e) => {
                                            const [start, end] = e.target.value.split('-').map(Number);
                                            handleFilterChange('displayHourRange', { startHour: start, endHour: end });
                                        }}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        {selectOptions}
                                    </select>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGetData}
                                        disabled={!ciclo}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!ciclo
                                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                            }`}
                                    >
                                        📊 Cargar Ciclo
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-sm font-medium transition-colors"
                                        title="Limpiar filtros"
                                    >
                                        🔄
                                    </button>
                                    <button
                                        onClick={handleSaveData}
                                        disabled={modifiedData.length === 0}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${modifiedData.length === 0
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                                            }`}
                                    >
                                        <span>💾</span>
                                        <span className="text-sm">Guardar</span>
                                        {modifiedData.length > 0 && (
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                                {modifiedData.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main className="max-w-[1920px] mx-auto p-3 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                    {filteredData.slice(1).map((day, visibleDayIndex) => {
                        const realDayIndex = visibleDayIndex + 1;
                        const dayMapping = indexMapping.get(day.id);
                        if (!dayMapping) return null;

                        return (
                            <div key={day.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                                {/* Header del día */}
                                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <span>📅</span>
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                                                    {dias[day.id - 1]}
                                                </h2>
                                                <p className="text-sm text-slate-500">
                                                    {day.employees?.length || 0} turnos
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-slate-900">
                                                {((day.employees?.reduce((total, emp) =>
                                                    total + emp.workShift.filter(w => w === "WORK").length, 0
                                                ) || 0) * 0.25).toFixed(1)} horas
                                            </div>
                                            <div className="text-xs text-slate-500">Total del día</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de turnos */}
                                <div className="overflow-x-auto">
                                    <div
                                        className="grid bg-slate-200 min-w-max"
                                        style={{ gridTemplateColumns: gridColumns }}
                                    >
                                        <div className="bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 border-r flex items-center">
                                            <span className="mr-1">👥</span>
                                            <span className="hidden sm:inline">Sección</span>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 border-r flex items-center">
                                            <span className="mr-1">🔄</span>
                                            <span className="hidden sm:inline">Turno</span>
                                        </div>
                                        <HeadRow />
                                        <div className="bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 text-center border-l flex items-center justify-center">
                                            <span className="hidden sm:inline">Total</span>
                                        </div>
                                    </div>

                                    {day.employees?.map((employee) => {
                                        const originalEmployeeIndex = dayMapping.employeeMap.get(employee.id);
                                        if (originalEmployeeIndex === undefined) return null;

                                        return (
                                            <div
                                                key={employee.id}
                                                className="grid bg-slate-200 min-w-max"
                                                style={{ gridTemplateColumns: gridColumns }}
                                            >
                                                <GenericEmployeeRow
                                                    employee={employee}
                                                    dayIndex={dayMapping.dayIndex}
                                                    employeeIndex={originalEmployeeIndex}
                                                    numRows={day.employees.length}
                                                    numDays={filteredData.length}
                                                    inputRefsMatrix={inputRefsMatrix}
                                                    dispatch={dispatch}
                                                    previousEmployee={
                                                        filteredData[realDayIndex - 1]?.employees?.find(
                                                            e => e.id === employee.id
                                                        )
                                                    }
                                                    rangeConfig={rangeConfig}
                                                />
                                            </div>
                                        );
                                    })}

                                    {/* Fila distribución */}
                                    <div
                                        className="grid bg-slate-300 min-w-max border-t-2 border-slate-400"
                                        style={{ gridTemplateColumns: gridColumns }}
                                    >
                                        <DistributionRow
                                            day={day}
                                            originalDay={data[dayMapping.dayIndex]}
                                            showFullDistribution={showFullDistribution}
                                            onToggle={() => setShowFullDistribution(!showFullDistribution)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <span className="text-xl text-slate-600">📊</span>
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Resumen de Horarios</h2>
                                    <p className="text-sm text-slate-500">
                                        {stats.employees} turnos • {stats.days} días • {stats.hours.toFixed(1)} horas totales
                                    </p>
                                </div>
                            </div>
                        </div>
                        <RosterRangeSummary data={filteredData.slice(1)} />
                    </div>
                </div>
            </main>
        </div>
    );
};