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
        const hoursPaid = hoursPaidInput[bank.employee.id] ?? bank.hoursTotal;
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
                    Consulta libre
                </button>
                <button
                    onClick={() => setMode("gestion")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === "gestion"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Gestión de bolsa
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
                            {periods.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.startDate} → {p.endDate})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Cabecera de métricas */}
            {report && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow p-6 col-span-1 md:col-span-4 flex flex-col justify-center">
                        <h3 className="text-sm font-medium text-gray-500">Horas totales</h3>
                        <p className="mt-3 text-5xl font-extrabold text-gray-900">
                            {report?.totalHours}
                        </p>
                        <div className="mt-3 text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-6">
                            <p>Base FTE: <span className="font-medium text-gray-700">{report?.baseFte}</span></p>
                            <p>Extra FTE: <span className="font-medium text-gray-700">{report?.extraFte}</span></p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500">Horas trabajadas</h3>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{report?.totalWorkHours}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500">Horas complementarias</h3>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{report?.totalExtraWorkHours}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500">Festivas</h3>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{report?.totalHolidayWorkHours}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500">Nocturnas</h3>
                        <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
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
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Empleado</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Horas jornada</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Horas trabajadas</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Complementarias</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Festivas</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Nocturnas</th>
                                {mode === "gestion" && (
                                    <>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">DI arrastrada</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Total bolsa</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">A pagar</th>
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
                                const hoursPaid = hoursPaidInput[emp.employee.id] ?? bank?.hoursTotal ?? "";
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
                                        <td className="px-6 py-4 text-sm text-gray-900">0</td>
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