import { useEffect, useReducer, useMemo, useRef, useState, useCallback, useContext } from "react";
import { useRoster } from "../roster/hooks/useRoster";
import { rosterReducer } from "../roster/reducers/rosterReducer";
import { useReactToPrint } from "react-to-print";

import { DistributionRow } from "../roster/components/DistributionRow";
import { HeadRow } from "../roster/components/HeadRow";
import { EmployeeRow } from "../roster/components/EmployeeRow";
import { RosterRangeSummary } from "../roster/components/RosterRangeSummary";
import { PrintableRoster } from "../roster/components/PrintableRoster";
import { AppContext } from "@/context/AppContext";
import DateRangePicker from "@/roster/components/DateRangePicker";
import { getVisibleRange, HOUR_RANGE_PRESETS } from "@/utils/rangeCalculator";

export const RosterPage = () => {
    const [data, dispatch] = useReducer(rosterReducer, []);
    const inputRefsMatrix = useRef([]);


    const { filters, setFilters } = useContext(AppContext)
    const { apiData, loading, error, saveData } = useRoster(filters.startDate, filters.endDate);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);
    const [showFullDistribution, setShowFullDistribution] = useState(false); // Agregar este estado

    const dropdownDesktopRef = useRef(null);
    const dropdownMobileRef = useRef(null);

    // Ref para el componente imprimible
    const printableRef = useRef(null);

    // ✅ Memoizar equipos únicos
    const availableTeams = useMemo(() => {
        const teams = new Set();
        data.forEach(day => {
            day.employees?.forEach(emp => {
                if (emp.teamWork) teams.add(emp.teamWork);
            });
        });
        return Array.from(teams).sort();
    }, [data]);

    // ✅ Crear mapeo de índices una sola vez
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

    // ✅ Cachear el cálculo del rango visible para el grid (con validación de seguridad)
    const visibleSlots = useMemo(() => {
        const displayRange = filters?.displayHourRange ?? { startHour: 7, endHour: 22.5 };
        const range = getVisibleRange(displayRange.startHour, displayRange.endHour);
        return range.visibleSlots;
    }, [filters?.displayHourRange?.startHour, filters?.displayHourRange?.endHour]);

    // ✅ Grid layout dinámico basado en visibleSlots
    const gridColumns = useMemo(() => {
        return `120px 150px repeat(${visibleSlots}, 20px) 80px`;
    }, [visibleSlots]);

    // ✅ Optimizar datos filtrados (ACTUALIZADO CON FILTRO DE HORAS)
    const filteredData = useMemo(() => {
        if (!data.length) return [];

        const hasTeamFilter = filters.selectedTeams.length > 0;
        const hasNameFilter = filters.employeeName.trim() !== "";
        const hasHoursFilter = filters.hideZeroHours;

        if (!hasTeamFilter && !hasNameFilter && !hasHoursFilter) {
            return data; // Sin filtros, devolver datos originales
        }

        const normalizedName = hasNameFilter ? filters.employeeName.toLowerCase() : "";

        return data.map(day => ({
            ...day,
            employees: day.employees?.filter(emp => {
                // Filtro por equipo
                if (hasTeamFilter && !filters.selectedTeams.includes(emp.teamWork)) {
                    return false;
                }

                // Filtro por nombre
                if (hasNameFilter) {
                    const fullName = `${emp.name} ${emp.lastName || ""}`.toLowerCase();
                    if (!fullName.includes(normalizedName)) {
                        return false;
                    }
                }

                // ✅ NUEVO: Filtro por horas cero
                if (hasHoursFilter) {
                    const totalHours = (emp.workShift.filter(w => w === "WORK").length * 15) / 60;
                    if (totalHours === 0) {
                        return false;
                    }
                }

                return true;
            }) || []
        }));
    }, [data, filters.selectedTeams, filters.employeeName, filters.hideZeroHours]);

    // ✅ Optimizar modifiedData
    const modifiedData = useMemo(() => {
        const result = [];

        // ✅ Cambiar esto:
        for (let dayIndex = 1; dayIndex < data.length; dayIndex++) {  // <- Usar 'data'
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
    }, [data]);  // <- Depender solo de 'data'

    // ✅ Callbacks memoizados
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleTeamToggle = useCallback((team) => {
        setFilters(prev => ({
            ...prev,
            selectedTeams: prev.selectedTeams.includes(team)
                ? prev.selectedTeams.filter(t => t !== team)
                : [...prev.selectedTeams, team]
        }));
    }, []);

    const handleSelectAllTeams = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            selectedTeams: prev.selectedTeams.length === availableTeams.length
                ? []
                : [...availableTeams]
        }));
    }, [availableTeams]);

    const handleGetData = () => {
        // Ya no necesitas llamar a getRosterBetweenDates()
        // TanStack Query ya está observando filters.startDate/endDate
        setShowMobileFilters(false);
        setShowTeamDropdown(false);
    };

    // ✅ ACTUALIZADO: incluir hideZeroHours y displayHourRange en clearFilters
    const clearFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            selectedTeams: [],
            employeeName: "",
            hideZeroHours: false,
            displayHourRange: { startHour: 7, endHour: 22.5 }, // ✅ Reset a rango original
        }));
        setShowTeamDropdown(false);
    }, []);

    useEffect(() => {
        if (apiData.length > 0) {
            dispatch({ type: "SET_ROSTER", payload: apiData });
        }
    }, [apiData]);

    const handleSaveData = async () => {
        try {
            // Usamos mutateAsync del hook que creamos antes
            await saveData(modifiedData);

            // Si llega aquí, es que fue EXITOSO (el hook lanzó el invalidateQueries)
            console.log("✅ Datos guardados y tabla actualizada automáticamente");

            // Aquí puedes limpiar estados locales si tenías algo como:
            // setModifiedData([]); 

        } catch (error) {
            // El error viene directamente del throw que pusimos en el hook
            console.error("❌ Error al guardar:", error.message);
        }
    };

    // Función para imprimir
    const handlePrint = useReactToPrint({
        contentRef: printableRef,
        documentTitle: `Roster_${filters.startDate || 'inicio'}_${filters.endDate || 'fin'}`,
        pageStyle: `
            @page {
                size: A4 portrait;
                margin: 0.3cm 0.2cm;
            }
            body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }
        `,
        onBeforeGetContent: () => {
            console.log('🖨️ Preparando impresión...');
        },
        onAfterPrint: () => {
            console.log('✅ Impresión completada');
        },
        onPrintError: (errorLocation, error) => {
            console.error('❌ Error de impresión:', errorLocation, error);
        }
    });

    // ✅ Estadísticas optimizadas
    const stats = useMemo(() => {
        const uniqueEmployees = new Set();
        let totalHours = 0;

        for (let i = 1; i < filteredData.length; i++) {
            const day = filteredData[i];
            if (!day.employees?.length) continue;

            for (const emp of day.employees) {
                uniqueEmployees.add(emp.id);
                for (const shift of emp.workShift) {
                    if (shift === "WORK") {
                        totalHours += 0.25;
                    }
                }
            }
        }

        return {
            employees: uniqueEmployees.size,
            hours: totalHours,
            days: Math.max(0, filteredData.length - 1)
        };
    }, [filteredData]);

    // ✅ Componente MultiSelect memoizado
    const TeamMultiSelect = useCallback(({ isMobile = false }) => (
        <div className="relative" ref={isMobile ? dropdownMobileRef : dropdownDesktopRef}>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                {isMobile ? "Filtrar por Equipos" : "Equipos"}
            </label>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowTeamDropdown(!showTeamDropdown);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
            >
                <span className="truncate">
                    {filters.selectedTeams.length === 0
                        ? "Seleccionar equipos..."
                        : filters.selectedTeams.length === availableTeams.length
                            ? "Todos los equipos"
                            : `${filters.selectedTeams.length} equipo${filters.selectedTeams.length > 1 ? 's' : ''} seleccionado${filters.selectedTeams.length > 1 ? 's' : ''}`
                    }
                </span>
                <span className={`transition-transform ${showTeamDropdown ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {showTeamDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAllTeams();
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer border-b border-slate-200 flex items-center space-x-2"
                    >
                        <input
                            type="checkbox"
                            checked={filters.selectedTeams.length === availableTeams.length}
                            onChange={() => { }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                        />
                        <span className="text-sm font-medium text-slate-700">
                            {filters.selectedTeams.length === availableTeams.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                        </span>
                    </div>

                    {availableTeams.map(team => (
                        <div
                            key={team}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTeamToggle(team);
                            }}
                            className="px-3 py-2 hover:bg-slate-100 cursor-pointer flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={filters.selectedTeams.includes(team)}
                                onChange={() => { }}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                            />
                            <span className="text-sm text-slate-700">{team}</span>
                        </div>
                    ))}

                    {availableTeams.length === 0 && (
                        <div className="px-3 py-2 text-sm text-slate-500 text-center">
                            No hay equipos disponibles
                        </div>
                    )}
                </div>
            )}
        </div>
    ), [filters.selectedTeams, availableTeams, showTeamDropdown, handleTeamToggle, handleSelectAllTeams]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showTeamDropdown) {
                const isClickOutsideDesktop = dropdownDesktopRef.current && !dropdownDesktopRef.current.contains(event.target);
                const isClickOutsideMobile = dropdownMobileRef.current && !dropdownMobileRef.current.contains(event.target);

                if (isClickOutsideDesktop && isClickOutsideMobile) {
                    setShowTeamDropdown(false);
                }
            }
        };

        if (showTeamDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showTeamDropdown]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
            {/* Componente oculto para impresión - Optimizado para móvil y PC */}
            <div style={{
                display: 'none',
                visibility: 'hidden',
                position: 'absolute',
                left: '-10000px',
                top: '-10000px',
                width: '210mm',
                height: '297mm',
                overflow: 'hidden'
            }}>
                <PrintableRoster
                    ref={printableRef}
                    data={filteredData.slice(1)}
                    filters={filters}
                />
            </div>

            {/* Header Principal */}
            <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-[1920px] mx-auto">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src="./logo-navegador.webp"
                                alt="WorkSchedFlow Logo"
                                width="48"
                                height="48"
                            />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Roster Board
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                                    Gestión de equipos de trabajo
                                </p>
                            </div>
                        </div>

                        {/* Desktop Stats */}
                        <div className="hidden xl:flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 h-10 bg-slate-100 rounded-lg">
                                <span>👥</span>
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {stats.employees} Empleados
                                </span>
                            </div>

                            <div className="flex items-center gap-2 px-3 h-10 bg-slate-100 rounded-lg">
                                <span>⏰</span>
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {stats.hours.toFixed(1)} Horas
                                </span>
                            </div>

                            {filters.selectedTeams.length > 0 && (
                                <div className="flex items-center gap-2 px-3 h-10 bg-blue-100 rounded-lg">
                                    <span>🔍</span>
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {filters.selectedTeams.length} equipo{filters.selectedTeams.length > 1 ? "s" : ""}
                                    </span>
                                </div>
                            )}

                            {modifiedData.length > 0 && (
                                <div className="flex items-center gap-2 px-3 h-10 bg-amber-100 rounded-lg">
                                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium whitespace-nowrap">
                                        {modifiedData.length} Cambios
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={handlePrint}
                                disabled={filteredData.length <= 1}
                                className={`flex items-center gap-2 px-4 h-10 rounded-lg font-medium whitespace-nowrap ${filteredData.length <= 1
                                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                    }`}
                            >
                                <span>🖨️</span>
                                <span className="text-sm">Imprimir</span>
                            </button>
                        </div>

                        {/* Mobile/Tablet Actions */}
                        <div className="xl:hidden flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                disabled={filteredData.length <= 1}
                                className="p-2 rounded-lg"
                            >
                                <span className="text-lg">🖨️</span>
                            </button>

                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <span className="text-lg">🔍</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={`border-t border-slate-200 bg-slate-50 ${showMobileFilters ? "block" : "hidden xl:block"}`}>
                        <div className="px-4 sm:px-6 py-4">

                            {/* Desktop Filters */}
                            <div className="hidden xl:grid xl:grid-cols-12 gap-4 items-end">

                                {/* Fechas */}
                                <div className="col-span-3">
                                    <DateRangePicker
                                        filters={filters}
                                        handleFilterChange={handleFilterChange}
                                    />
                                </div>

                                {/* Equipos */}
                                <div className="col-span-3">
                                    <TeamMultiSelect />
                                </div>

                                {/* Empleado */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Empleado
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={filters.employeeName}
                                        onChange={(e) =>
                                            handleFilterChange("employeeName", e.target.value)
                                        }
                                        className="w-full px-3 h-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Rango de Horas */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Rango Horario
                                    </label>
                                    <select
                                        value={`${(filters?.displayHourRange?.startHour ?? 7)}-${(filters?.displayHourRange?.endHour ?? 22.5)}`}
                                        onChange={(e) => {
                                            const [start, end] = e.target.value.split('-').map(Number);
                                            handleFilterChange('displayHourRange', { startHour: start, endHour: end });
                                        }}
                                        className="w-full px-3 h-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        {HOUR_RANGE_PRESETS.map(preset => (
                                            <option key={preset.id} value={`${preset.startHour}-${preset.endHour}`}>
                                                {preset.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Botones */}
                                <div className="col-span-2 flex gap-2 items-stretch">
                                    <button
                                        onClick={handleGetData}
                                        disabled={loading}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 h-10 rounded-lg text-sm font-medium whitespace-nowrap ${loading
                                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                    >
                                        <span>{loading ? "⏳" : "📊"}</span>
                                        <span>{loading ? "Cargando..." : "Preparado"}</span>
                                    </button>

                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center justify-center px-3 h-10 border border-slate-300 rounded-lg hover:bg-slate-100"
                                    >
                                        🔄
                                    </button>
                                </div>

                                {/* Guardar */}
                                <div className="col-span-2">
                                    <button
                                        onClick={handleSaveData}
                                        disabled={modifiedData.length === 0 || loading}
                                        className={`w-full flex items-center justify-center gap-2 px-4 h-10 rounded-lg font-medium whitespace-nowrap ${modifiedData.length === 0 || loading
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 text-white"
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

                            {/* Mobile/Tablet Filters */}
                            <div className="xl:hidden space-y-4">

                                <DateRangePicker
                                    filters={filters}
                                    handleFilterChange={handleFilterChange}
                                />

                                <TeamMultiSelect isMobile={true} />

                                <input
                                    type="text"
                                    placeholder="Buscar empleado..."
                                    value={filters.employeeName}
                                    onChange={(e) =>
                                        handleFilterChange("employeeName", e.target.value)
                                    }
                                    className="w-full px-3 h-10 border border-slate-300 rounded-lg text-sm"
                                />

                                <select
                                    value={`${(filters?.displayHourRange?.startHour ?? 7)}-${(filters?.displayHourRange?.endHour ?? 22.5)}`}
                                    onChange={(e) => {
                                        const [start, end] = e.target.value.split('-').map(Number);
                                        handleFilterChange('displayHourRange', { startHour: start, endHour: end });
                                    }}
                                    className="w-full px-3 h-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    {HOUR_RANGE_PRESETS.map(preset => (
                                        <option key={preset.id} value={`${preset.startHour}-${preset.endHour}`}>
                                            {preset.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleGetData}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 h-10 bg-blue-600 text-white rounded-lg whitespace-nowrap"
                                    >
                                        📊 <span>{loading ? "Cargando..." : "Preparado"}</span>
                                    </button>

                                    <button
                                        onClick={handleSaveData}
                                        disabled={modifiedData.length === 0 || loading}
                                        className="flex items-center justify-center gap-2 h-10 bg-green-600 text-white rounded-lg whitespace-nowrap"
                                    >
                                        💾 <span>Guardar</span>
                                        {modifiedData.length > 0 && (
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                                {modifiedData.length}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full h-10 border border-slate-300 rounded-lg"
                                >
                                    🔄 Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-[1920px] mx-auto p-3 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                    {filteredData.slice(1).map((day, visibleDayIndex) => {
                        const realDayIndex = visibleDayIndex + 1;

                        // ✅ Obtener mapeo una sola vez por día
                        const dayMapping = indexMapping.get(day.id);
                        if (!dayMapping) return null;

                        return (
                            <div key={day.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                {/* Header del Día */}
                                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <span className="">📅</span>
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                                                    {new Date(day.id).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}{day.holiday ? "🎉" : ""}
                                                </h2>
                                                <p className="text-sm text-slate-500 capitalize">
                                                    {day.day} • {day.employees?.length || 0} empleados
                                                    {/* ✅ Mostrar indicador si hay filtros activos */}
                                                    {filters.hideZeroHours || filters.selectedTeams.length > 0 || filters.employeeName && (
                                                        <span className="text-blue-600 ml-1">
                                                            (filtrados de {data[dayMapping.dayIndex]?.employees?.length || 0})
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Estadísticas del día */}
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
                                </div>

                                {/* Tabla de Turnos */}
                                <div className="overflow-x-auto">
                                    <div
                                        className="grid  bg-slate-200 min-w-max"
                                        style={{
                                            gridTemplateColumns: gridColumns,
                                        }}
                                    >
                                        {/* Headers */}
                                        <div className="bg-slate-100 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 border-r flex items-center">
                                            <span className="mr-1">👥</span>
                                            <span className="hidden sm:inline">Equipo</span>
                                        </div>
                                        <div className="bg-slate-100 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 border-r flex items-center">
                                            <span className="mr-1">👤</span>
                                            <span className="hidden sm:inline">Empleado</span>
                                        </div>

                                        <HeadRow />

                                        <div className="bg-slate-100 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 text-center border-l flex items-center justify-center">
                                            <span className="mr-1">
                                                <button onClick={() => handleFilterChange('hideZeroHours', !filters.hideZeroHours)}>
                                                    ⏰
                                                </button>
                                            </span>
                                            <span className="hidden sm:inline">Total</span>
                                        </div>
                                    </div>

                                    {/* ✅ Optimizar mapeo de empleados */}
                                    {day.employees?.map((employee) => {
                                        const originalEmployeeIndex = dayMapping.employeeMap.get(employee.id);

                                        if (originalEmployeeIndex === undefined) return null;

                                        return (
                                            <div
                                                key={employee.id}
                                                className={`grid  bg-slate-200 min-w-max transition-all duration-200`}
                                                style={{ gridTemplateColumns: gridColumns }}
                                            >
                                                <EmployeeRow
                                                    employee={employee}
                                                    dayIndex={dayMapping.dayIndex}
                                                    employeeIndex={originalEmployeeIndex}
                                                    numRows={day.employees.length}
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
                                        );
                                    })}

                                    {/* Fila de Distribución */}
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

                    {/* Resumen */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <span className="text-xl text-slate-600">📊</span>
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Resumen de Horarios</h2>
                                    <p className="text-sm text-slate-500">
                                        {stats.employees} empleados • {stats.days} días • {stats.hours.toFixed(1)} horas totales
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
