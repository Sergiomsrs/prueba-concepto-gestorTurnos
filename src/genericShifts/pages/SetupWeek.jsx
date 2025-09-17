import { useEffect, useState } from "react";
import { useCyclesGenerator } from "../../Hooks/useCyclesGenerator";
import { useEmployees } from "../../Hooks/useEmployees";
import { DateRangePicker } from "../components/DateRangePicker";
import { OptionsPicker } from "../components/OptionsPicker";

export const SetupWeek = () => {
    const {
        ciclo,
        defaultRoles,
        roles,
        handleCreateByGeneric,
        handleGetAllRoles,
        handleGetRolesByDefault,
        setCiclo,
        handleGetAllRolesWihtDefaults,
    } = useCyclesGenerator();
    const { allEmployees, handleGetAllEmployees } = useEmployees();

    // Ahora es un array de objetos { employeeId, genericShiftId }
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [range, setRange] = useState({ start: "", end: "" });
    const [config, setConfig] = useState({ range: "", cicle: "", selectedEmployees: "" });

    console.log(JSON.stringify(defaultRoles))



    console.log("ss", selectedEmployees)

    useEffect(() => {
        handleGetAllEmployees();
    }, []);


    // Al seleccionar un empleado
    const handleSelectEmployee = (genericShiftId, employeeId) => {
        setSelectedEmployees(prev => {
            // Si ya existe ese genericShiftId, reemplaza el objeto
            const filtered = prev.filter(sel => sel.genericShiftId !== genericShiftId);
            // Si no se selecciona ninguno, solo elimina
            if (!employeeId) return filtered;
            // Si se selecciona, agrega el nuevo
            return [...filtered, { employeeId, genericShiftId }];
        });
    };

    // Saber si un empleado está repetido
    const employeeCounts = selectedEmployees.reduce((acc, obj) => {
        if (obj.employeeId) acc[obj.employeeId] = (acc[obj.employeeId] || 0) + 1;
        return acc;
    }, {});
    const isEmployeeRepeated = (employeeId) => employeeCounts[employeeId] > 1;

    const handleGetConfig = () => {
        const config = {
            cycle: ciclo,                // valor del ciclo seleccionado
            startDate: range.start,                // objeto { start, end }
            endDate: range.end,                // objeto { start, end }
            selectedEmployees     // array de objetos { employeeId, genericShiftId }
        };
        // Aquí puedes usar el objeto config, por ejemplo:
        console.log(config);
        // O hacer una llamada a la API con config
        setConfig(config); // Si quieres guardarlo en el estado
        handleCreateByGeneric(config)
    }

    useEffect(() => {
        if (defaultRoles && defaultRoles.length > 0 && selectedEmployees.length === 0) {
            // Inicializa selectedEmployees con los valores por defecto
            setSelectedEmployees(
                defaultRoles.map(dr => ({
                    employeeId: dr.employeeId,
                    genericShiftId: dr.shiftRoleId
                }))
            );
        }
    }, [defaultRoles]);

    return (
        <section className="mt-6">
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl shadow mb-8 border border-gray-200">
                <button
                    onClick={handleGetAllRolesWihtDefaults}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                    aria-label="Recargar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-reload"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                        <path d="M20 4v5h-5" />
                    </svg>
                </button>
                <DateRangePicker value={range} onChange={setRange} />
                <OptionsPicker value={ciclo} onChange={setCiclo} />
                <button
                    onClick={handleGetConfig}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition font-semibold"
                >
                    Enviar
                </button>
                <button
                    onClick={() => setSelectedEmployees([])}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition font-semibold"
                >
                    Resetear
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
                            const selectedObj = selectedEmployees.find(sel => sel.genericShiftId === row.id);
                            const selectedId = selectedObj ? selectedObj.employeeId : "";
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
                                            onChange={e => handleSelectEmployee(row.id, Number(e.target.value))}
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
