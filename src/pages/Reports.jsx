import { useState } from "react";
import { DatePicker } from "../utilComponents/DatePicker";

export const Reports = () => {
    const [date, setDate] = useState({ start: "", end: "" });
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        employee: "",
    });

    const handleSearch = () => {
        console.log(date.start)
        console.log(date.end)
    };

    // Datos de ejemplo (luego los traerás de la API con los filtros aplicados)
    const summary = {
        totalHours: 1280,
        vacationHours: 120,
        overtimeHours: 85,
        holidayHours: 40,
    };

    const employees = [
        { id: 1, name: "Juan Pérez", jornada: 160, worked: 152, overtime: 10, holidays: 8 },
        { id: 2, name: "Ana López", jornada: 160, worked: 170, overtime: 15, holidays: 0 },
        { id: 3, name: "Carlos García", jornada: 160, worked: 140, overtime: 5, holidays: 12 },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 space-y-8 mt-12">
            {/* Barra de filtrado */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                <DatePicker date={date} setDate={setDate} onSearch={handleSearch} />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Empleado</label>
                    <select
                        name="employee"
                        value={filters.employee}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200"
                    >
                        <option value="">Todos</option>
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    Buscar
                </button>
            </div>

            {/* Cabecera de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Horas totales</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{summary.totalHours}</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Horas vacaciones</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{summary.vacationHours}</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Horas complementarias</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{summary.overtimeHours}</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Festivas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{summary.holidayHours}</p>
                </div>
            </div>

            {/* Tabla de empleados */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Detalle por empleado</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Empleado</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Horas jornada</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Horas trabajadas</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Complementarias</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Festivas</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map((emp) => (
                                <tr key={emp.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.jornada}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.worked}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.overtime}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.holidays}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
