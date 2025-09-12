import { useEffect, useState } from "react";
import { useCyclesGenerator } from "../../Hooks/useCyclesGenerator";
import { useEmployees } from "../../Hooks/useEmployees";

export const SetupWeek = () => {
    const { roles, handleGetAllRoles } = useCyclesGenerator();
    const { allEmployees, handleGetAllEmployees } = useEmployees();

    // Ahora es un array de objetos { empleadoId, genericShiftId }
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    console.log(selectedEmployees)

    useEffect(() => {
        handleGetAllEmployees();
    }, []);

    // Al seleccionar un empleado
    const handleSelectEmployee = (genericShiftId, empleadoId) => {
        setSelectedEmployees(prev => {
            // Si ya existe ese genericShiftId, reemplaza el objeto
            const filtered = prev.filter(sel => sel.genericShiftId !== genericShiftId);
            // Si no se selecciona ninguno, solo elimina
            if (!empleadoId) return filtered;
            // Si se selecciona, agrega el nuevo
            return [...filtered, { empleadoId, genericShiftId }];
        });
    };

    // Saber si un empleado está repetido
    const employeeCounts = selectedEmployees.reduce((acc, obj) => {
        if (obj.empleadoId) acc[obj.empleadoId] = (acc[obj.empleadoId] || 0) + 1;
        return acc;
    }, {});
    const isEmployeeRepeated = (empleadoId) => employeeCounts[empleadoId] > 1;

    return (
        <section className="mt-6">
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={handleGetAllRoles}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                >
                    Click
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                >
                    Seleccionar fechas
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                >
                    Seleccionar Ciclo
                </button>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nombre del Rol
                            </th>
                            <th scope="col" className="px-6 py-3">
                                WWH
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Equipo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Empleado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((row) => {
                            // Busca si hay un empleado seleccionado para este genericShiftId (row.name)
                            const selectedObj = selectedEmployees.find(sel => sel.genericShiftId === row.name);
                            const selectedId = selectedObj ? selectedObj.empleadoId : "";
                            const repeated = selectedId && isEmployeeRepeated(selectedId);

                            return (
                                <tr
                                    key={row.name}
                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                                >
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        {row.name}
                                    </th>
                                    <td className="px-6 py-4">{row.wwh}</td>
                                    <td className="px-6 py-4">{row.teamwork}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            className={`border rounded px-2 py-1 transition-colors duration-200 ${repeated
                                                ? "border-red-500 bg-red-100"
                                                : "border-gray-300 bg-white"
                                                }`}
                                            value={selectedId}
                                            onChange={e => handleSelectEmployee(row.name, e.target.value)}
                                        >
                                            <option value="">Selecciona empleado</option>
                                            {allEmployees.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.name} {emp.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href="#"
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        >
                                            Edit
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
