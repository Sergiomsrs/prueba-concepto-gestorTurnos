import { useState } from "react";
import { DatePicker } from "../utilComponents/DatePicker";
import { UseReportGenerator } from "../Hooks/UseReportGenerator";


export const Reports = () => {
    const [date, setDate] = useState({ start: "", end: "" });
    const { handleGetReportBetweenDates, report, isLoading, error } = UseReportGenerator();

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        employee: "",
    });

    const handleSearch = () => {
        handleGetReportBetweenDates(date.start, date.end);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 space-y-8 mt-12 sm:px-16">
            {/* Mostrar loader o error */}

            {/* Barra de filtrado */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                <DatePicker date={date} setDate={setDate} onSearch={handleSearch} />
            </div>

            {/* Cabecera de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Horas Totales */}
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

                {/* Horas trabajadas */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Horas trabajadas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{report?.totalWorkHours}</p>
                </div>

                {/* Horas complementarias */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Horas complementarias</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{report?.totalExtraWorkHours}</p>
                </div>

                {/* Festivas */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Festivas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Nocturnas</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">0</p>
                </div>
            </div>


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
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading &&
                                <tr>
                                    <td className="text-blue-600 font-semibold p-12">Cargando reporte...</td>
                                </tr>}
                            {error &&
                                <tr>
                                    <td className="text-red-600 font-semibold">{error}</td>
                                </tr>

                            }
                            {report?.reportRequestDto?.map && report.reportRequestDto.map((emp) => (
                                <tr key={emp.employee.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.employee.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.totalWWH}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.totalWorkHours}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.extraHours}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{emp.totalHolidayHours}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">0</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
