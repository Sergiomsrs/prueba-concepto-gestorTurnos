import { useState } from "react";
import { DatePicker } from "@/utilComponents/DatePicker";
import { UseReportGenerator } from "@/Hooks/UseReportGenerator";
import { useHourBank } from "@/reports/hooks/useHourBank";


export const Reports = () => {
    const [mode, setMode] = useState("consulta");
    const currentYear = new Date().getFullYear();

    // Modo consulta
    const [date, setDate] = useState({ start: "", end: "" });
    const { handleGetReportBetweenDates, report: consultaReport, isLoading: consultaLoading, error: consultaError } = UseReportGenerator();

    // Modo gestión
    const {
        periods,
        selectedPeriodId,
        setSelectedPeriodId,
        report: gestionReport,
        banks,
        isLoading: gestionLoading,
        isClosing,
        isReopening,
        error: gestionError,
        closeBank,
        reopenBank,
    } = useHourBank();

    const [hoursPaidInput, setHoursPaidInput] = useState({});

    const report = mode === "consulta" ? consultaReport : gestionReport;
    const isLoading = mode === "consulta" ? consultaLoading : gestionLoading;
    const error = mode === "consulta" ? consultaError : gestionError;

    const handleSearch = () => handleGetReportBetweenDates(date.start, date.end);

    const handlePeriodChange = (e) => {
        setSelectedPeriodId(e.target.value);
        setHoursPaidInput({});
    };

    const handleHoursPaidChange = (employeeId, value) => {
        setHoursPaidInput(prev => ({ ...prev, [employeeId]: value }));
    };

    const handleCloseBank = async (bank) => {
        const raw = hoursPaidInput[bank.employee.id] ?? bank.hoursTotal;
        const hoursPaid = Math.max(0, parseFloat(raw) || 0);
        await closeBank(bank.id, hoursPaid);
    };

    const getBankForEmployee = (employeeId) => {
        return banks.find(b => b.employee.id === employeeId) || null;
    };

    const hasExtraHoursChanged = (emp, bank) => {
        if (!bank || bank.status !== "CLOSED") return false;
        if (bank.hoursGenerated === null) return false;
        return parseFloat(emp.extraHours) !== parseFloat(bank.hoursGenerated);
    };

    const hasWorkHoursChanged = (emp, bank) => {
        if (!bank || bank.status !== "CLOSED") return false;
        if (bank.hoursGenerated === null) return false;
        return parseFloat(emp.totalWorkHours) !== parseFloat(bank.hoursGenerated) + parseFloat(emp.totalWWH);
    };

    return (
        <div className="p-6 space-y-8 mt-12 sm:px-16">

            {/* Selector de modo */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setMode("consulta")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === "consulta"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Ver Previsión
                </button>
                <button
                    onClick={() => setMode("gestion")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === "gestion"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Cierre mes
                </button>
            </div>

            {/* Barra de filtrado */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                {mode === "consulta" ? (
                    <DatePicker date={date} setDate={setDate} onSearch={handleSearch} />
                ) : (
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-600">Periodo</label>
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedPeriodId || ""}
                            onChange={handlePeriodChange}
                        >
                            <option value="">Selecciona un periodo</option>
                            {periods
                                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                                .map(p => {
                                    // Capitalizar el nombre (MARZO -> Marzo)
                                    const formattedName = p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase();

                                    // Opcional: Acortar las fechas para que no ocupen tanto
                                    // De 2024-03-01 a 01/03
                                    const shortStart = p.startDate.split('-').reverse().slice(0, 2).join('/');
                                    const shortEnd = p.endDate.split('-').reverse().slice(0, 2).join('/');

                                    return (
                                        <option key={p.id} value={p.id}>
                                            {formattedName} | {shortStart} al {shortEnd}
                                        </option>
                                    );
                                })
                            }
                        </select>
                    </div>
                )}
            </div>

            {report && (
                /* Contenedor principal: Menos redondeado, borde más serio */
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                        {/* 🚀 BLOQUE 1: KPI MAESTRO (FTE) - Más contundente */}
                        <div className="md:col-span-12 lg:col-span-4 bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-center">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-2">
                                Capacidad Operativa
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-slate-900 leading-none tracking-tighter">
                                    {report?.totalFte}
                                </span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Total FTE</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dotted border-slate-200">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Base FTE</p>
                                    <p className="text-xl font-bold text-slate-800">{report?.baseFte}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Extra FTE</p>
                                    <p className="text-xl font-bold text-blue-700">+{report?.extraFte}</p>
                                </div>
                            </div>
                        </div>

                        {/* 📊 BLOQUE 2: GESTIÓN DE HORAS - Corregido desbordamiento */}
                        <div className="md:col-span-7 lg:col-span-5 flex flex-col gap-4">
                            {/* Usamos grid-cols-1 para móviles y sm:grid-cols-3 para tablets/pc */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-grow">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contrato</p>
                                    <p className="text-xl font-bold text-slate-800">{report?.totalHours}<span className="text-sm ml-0.5 font-medium text-slate-400">h</span></p>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200 border-t-4 border-t-emerald-500 flex flex-col justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Trabajadas</p>
                                    <p className="text-xl font-bold text-emerald-600">{report?.totalWorkHours}h</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-slate-200 border-t-4 border-t-orange-500 flex flex-col justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pendientes</p>
                                    <p className="text-xl font-bold text-orange-600">{report?.totalWorkHourNonCompleted}h</p>
                                </div>
                            </div>

                            {/* Complementarias con icono - Más prominente */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Horas Complementarias</p>
                                        <p className="text-sm text-slate-600">Adicionales trabajadas</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-black text-blue-700">{report?.totalExtraWorkHours}h</span>
                            </div>
                        </div>

                        {/* ℹ️ BLOQUE 3: INFO SECUNDARIA - Estilo lista técnica */}
                        <div className="md:col-span-5 lg:col-span-3 flex flex-col justify-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between group transition-colors hover:bg-slate-50">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">🌙 Nocturnas</span>
                                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded leading-none">{report?.totalNightHours}h</span>
                            </div>
                            <div className="px-4 py-3 flex items-center justify-between group transition-colors hover:bg-slate-50">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">🎉 Festivas</span>
                                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded leading-none">{report?.totalHolidayWorkHours}h</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Tabla de empleados */}
            <div className="bg-white rounded-2xl shadow overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Detalle por empleado</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 min-h-20">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Emp.</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Base</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">H. Trab</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Comp.</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Fest.</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Noct.</th>
                                {mode === "gestion" && (
                                    <>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">DI Prev.</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">T. Bolsa</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Pagadas</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">DI</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Acción</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading && (
                                <tr>
                                    <td className="text-blue-600 font-semibold p-12">Cargando reporte...</td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td className="text-red-600 font-semibold">{error}</td>
                                </tr>
                            )}
                            {report?.reportRequestDto?.map((emp) => {
                                const bank = mode === "gestion" ? getBankForEmployee(emp.employee.id) : null;
                                const hoursPaid = hoursPaidInput[emp.employee.id]
                                    ?? Math.max(0, parseFloat(bank?.hoursTotal) || 0);
                                const extraChanged = hasExtraHoursChanged(emp, bank);
                                const workChanged = hasWorkHoursChanged(emp, bank);

                                return (
                                    <tr key={emp.employee.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {emp.employee.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {emp.totalWWH}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-medium ${workChanged ? "text-red-600" : "text-gray-900"}`}>
                                            {emp.totalWorkHours}
                                            {workChanged && <span className="ml-1">⚠️</span>}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-medium ${extraChanged ? "text-red-600" : "text-gray-900"}`}>
                                            {emp.extraHours}
                                            {extraChanged && <span className="ml-1">⚠️</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {emp.totalHolidayHours}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{emp.nightlyHours}</td>
                                        {mode === "gestion" && (
                                            <>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {bank?.hoursDiCarried ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {bank?.hoursTotal ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {bank?.status === "CLOSED" ? (
                                                        bank?.hoursPaid
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            min="0"
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            value={hoursPaid}
                                                            onChange={(e) => handleHoursPaidChange(emp.employee.id, e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {bank?.hoursDi ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {bank ? (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${bank.status === "CLOSED"
                                                            ? "bg-green-100 text-green-700"
                                                            : bank.status === "REOPENED"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                            {bank.status}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin bolsa</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    {bank && bank.status !== "CLOSED" && (
                                                        <button
                                                            onClick={() => handleCloseBank(bank)}
                                                            disabled={isClosing}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            {isClosing ? "..." : "Cerrar"}
                                                        </button>
                                                    )}
                                                    {bank && bank.status === "CLOSED" && (
                                                        <button
                                                            onClick={() => reopenBank(bank.id)}
                                                            disabled={isReopening}
                                                            className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                                                        >
                                                            {isReopening ? "..." : "Reabrir"}
                                                        </button>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};