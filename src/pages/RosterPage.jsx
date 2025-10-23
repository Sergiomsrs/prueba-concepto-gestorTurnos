import { useEffect, useReducer, useMemo, useRef, useState, useCallback } from "react";
import { useRoster } from "../roster/hooks/useRoster";
import { rosterReducer } from "../roster/reducers/rosterReducer";
import { DistributionRow } from "../roster/components/DistributionRow";
import { HeadRow } from "../roster/components/HeadRow";
import { EmployeeRow } from "../roster/components/EmployeeRow";
import { RosterRangeSummary } from "../roster/components/RosterRangeSummary";

export const RosterPage = () => {
    const { getRosterBetweenDates, apiData, saveData, loading } = useRoster();
    const [data, dispatch] = useReducer(rosterReducer, []);
    const inputRefsMatrix = useRef([]);

    // 🔹 Estados para filtros
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        selectedTeams: [],
        employeeName: "",
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);

    const dropdownDesktopRef = useRef(null);
    const dropdownMobileRef = useRef(null);

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

    // ✅ Optimizar datos filtrados
    const filteredData = useMemo(() => {
        if (!data.length) return [];

        const hasTeamFilter = filters.selectedTeams.length > 0;
        const hasNameFilter = filters.employeeName.trim() !== "";

        if (!hasTeamFilter && !hasNameFilter) {
            return data; // Sin filtros, devolver datos originales
        }

        const normalizedName = hasNameFilter ? filters.employeeName.toLowerCase() : "";

        return data.map(day => ({
            ...day,
            employees: day.employees?.filter(emp => {
                if (hasTeamFilter && !filters.selectedTeams.includes(emp.teamWork)) {
                    return false;
                }

                if (hasNameFilter) {
                    const fullName = `${emp.name} ${emp.lastName || ""}`.toLowerCase();
                    if (!fullName.includes(normalizedName)) {
                        return false;
                    }
                }

                return true;
            }) || []
        }));
    }, [data, filters.selectedTeams, filters.employeeName]);

    // ✅ Optimizar modifiedData
    const modifiedData = useMemo(() => {
        const result = [];

        // Solo iterar dias que tienen empleados modificados
        for (let dayIndex = 1; dayIndex < filteredData.length; dayIndex++) {
            const day = filteredData[dayIndex];
            if (!day.employees?.length) continue;

            for (const emp of day.employees) {
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
    }, [filteredData]);

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

    const handleGetData = useCallback(() => {
        getRosterBetweenDates(filters.startDate, filters.endDate);
        setShowMobileFilters(false);
        setShowTeamDropdown(false);
    }, [getRosterBetweenDates, filters.startDate, filters.endDate]);

    const clearFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            selectedTeams: [],
            employeeName: ""
        }));
        setShowTeamDropdown(false);
    }, []);

    useEffect(() => {
        if (apiData.length > 0) {
            dispatch({ type: "SET_ROSTER", payload: apiData });
        }
    }, [apiData]);

    const handleSaveData = useCallback(async () => {
        const result = await saveData(modifiedData);
        if (result.success) {
            console.log("✅ Datos guardados exitosamente");
        } else {
            console.error("❌ Error al guardar:", result.message);
        }
    }, [saveData, modifiedData]);

    // ✅ Estadísticas optimizadas
    const stats = useMemo(() => {
        const uniqueEmployees = new Set();
        let totalHours = 0;

        // Usar for loop para mejor rendimiento
        for (let i = 1; i < filteredData.length; i++) {
            const day = filteredData[i];
            if (!day.employees?.length) continue;

            for (const emp of day.employees) {
                uniqueEmployees.add(emp.id);
                // Contar directamente sin filter
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header Principal */}
            <header className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-[1920px] mx-auto">
                    {/* Top Bar - Título y Botón Móvil */}
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                        <div className="flex items-center space-x-3">
                            <div className="">
                                <span className="text-white text-xl font-bold">
                                    <img
                                        src="./logo-navegador.webp"
                                        alt="WorkSchedFlow Logo"
                                        width="48"
                                        height="48"
                                        class=""
                                    />
                                </span>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Roster Board</h1>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Gestión de equipos de trabajo</p>
                            </div>
                        </div>

                        {/* Stats - Solo Desktop */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                                <span className="text-slate-600">👥</span>
                                <span className="text-sm font-medium text-slate-700">{stats.employees} Empleados</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                                <span className="text-slate-600">⏰</span>
                                <span className="text-sm font-medium text-slate-700">{stats.hours.toFixed(1)} Horas</span>
                            </div>
                            {filters.selectedTeams.length > 0 && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-lg">
                                    <span className="text-blue-600">🔍</span>
                                    <span className="text-sm font-medium text-blue-700">
                                        {filters.selectedTeams.length} equipo{filters.selectedTeams.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            {modifiedData.length > 0 && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-amber-100 rounded-lg">
                                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-amber-700">{modifiedData.length} Cambios</span>
                                </div>
                            )}
                        </div>

                        {/* Botón Filtros Móvil */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        >
                            <span className="text-lg">🔍</span>
                        </button>
                    </div>

                    {/* Controles de Filtros */}
                    <div className={`border-t border-slate-200 bg-slate-50 transition-all duration-300 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="px-4 sm:px-6 py-4">
                            {/* Filtros Desktop */}
                            <div className="hidden lg:grid lg:grid-cols-6 gap-4 items-end">
                                {/* Fechas */}
                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Fecha Inicio
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Fecha Fin
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* ✅ Filtro Equipos MultiSelect Desktop */}
                                <TeamMultiSelect />

                                {/* Filtro Empleado */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Empleado
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        value={filters.employeeName}
                                        onChange={(e) => handleFilterChange('employeeName', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleGetData}
                                        disabled={loading}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${loading
                                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                            }`}
                                    >
                                        {loading ? "⏳" : "📊"} {loading ? "Cargando..." : "Obtener"}
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                        title="Limpiar filtros"
                                    >
                                        🔄
                                    </button>
                                </div>

                                {/* Guardar */}
                                <div>
                                    <button
                                        onClick={handleSaveData}
                                        disabled={modifiedData.length === 0 || loading}
                                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm ${modifiedData.length === 0 || loading
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
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

                            {/* Filtros Móvil */}
                            <div className="lg:hidden space-y-4">
                                {/* Stats Móvil */}
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white px-3 py-2 rounded-lg border">
                                        <div className="text-lg font-semibold text-slate-900">{stats.employees}</div>
                                        <div className="text-xs text-slate-500">Empleados</div>
                                    </div>
                                    <div className="bg-white px-3 py-2 rounded-lg border">
                                        <div className="text-lg font-semibold text-slate-900">{stats.hours.toFixed(1)}</div>
                                        <div className="text-xs text-slate-500">Horas</div>
                                    </div>
                                    <div className="bg-white px-3 py-2 rounded-lg border">
                                        <div className="text-lg font-semibold text-slate-900">{stats.days}</div>
                                        <div className="text-xs text-slate-500">Días</div>
                                    </div>
                                </div>

                                {/* Fechas */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Fecha Inicio
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Fecha Fin
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Equipo y Empleado */}
                                <div className="space-y-3">
                                    {/* ✅ MultiSelect para móvil */}
                                    <TeamMultiSelect isMobile={true} />

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Buscar Empleado
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nombre o apellido..."
                                            value={filters.employeeName}
                                            onChange={(e) => handleFilterChange('employeeName', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleGetData}
                                        disabled={loading}
                                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${loading
                                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                            }`}
                                    >
                                        <span>{loading ? "⏳" : "📊"}</span>
                                        <span>{loading ? "Cargando..." : "Obtener Datos"}</span>
                                    </button>

                                    <button
                                        onClick={handleSaveData}
                                        disabled={modifiedData.length === 0 || loading}
                                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${modifiedData.length === 0 || loading
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                            }`}
                                    >
                                        <span>💾</span>
                                        <span>Guardar</span>
                                        {modifiedData.length > 0 && (
                                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                                                {modifiedData.length}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    🔄 Limpiar Filtros
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
                                                    })}
                                                </h2>
                                                <p className="text-sm text-slate-500 capitalize">
                                                    {day.day} • {day.employees?.length || 0} empleados
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

                                {/* Tabla de Turnos */}
                                <div className="overflow-x-auto">
                                    <div
                                        className="grid gap-px bg-slate-200 min-w-max"
                                        style={{
                                            gridTemplateColumns: "120px 150px repeat(62, 20px) 80px",
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
                                            <span className="mr-1">⏰</span>
                                            <span className="hidden sm:inline">Total</span>
                                        </div>
                                    </div>

                                    {/* ✅ Optimizar mapeo de empleados */}
                                    {day.employees?.map((employee) => {
                                        // Usar el mapeo precalculado
                                        const originalEmployeeIndex = dayMapping.employeeMap.get(employee.id);

                                        if (originalEmployeeIndex === undefined) return null;

                                        return (
                                            <div
                                                key={employee.id}
                                                className={`grid gap-px bg-slate-200 min-w-max transition-all duration-200`}
                                                style={{ gridTemplateColumns: "120px 150px repeat(62, 20px) 80px" }}
                                            >
                                                <EmployeeRow
                                                    employee={employee}
                                                    dayIndex={dayMapping.dayIndex} // ✅ Índice precalculado
                                                    employeeIndex={originalEmployeeIndex} // ✅ Índice precalculado
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
                                        className="grid gap-px bg-slate-300 min-w-max border-t-2 border-slate-400"
                                        style={{ gridTemplateColumns: "120px 150px repeat(62, 20px) 80px" }}
                                    >
                                        <DistributionRow day={day} />
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
