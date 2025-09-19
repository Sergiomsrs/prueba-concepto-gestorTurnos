import { useEffect, useState } from "react";
import { useCyclesGenerator } from "../../Hooks/useCyclesGenerator";
import { useEmployees } from "../../Hooks/useEmployees";
import { DateRangePicker } from "../components/DateRangePicker";
import { OptionsPicker } from "../components/OptionsPicker";
import { saveDefaultRole } from "../../services/genericShiftService";

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
        handleToggle,
    } = useCyclesGenerator();
    const { allEmployees, handleGetAllEmployees } = useEmployees();

    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [range, setRange] = useState({ start: "", end: "" });
    const [config, setConfig] = useState({ range: "", cicle: "", selectedEmployees: "" });

    useEffect(() => {
        handleGetAllEmployees();
    }, []);

    useEffect(() => {
        handleGetAllRolesWihtDefaults();
    }, []);


    const handleSelectEmployee = (genericShiftId, employeeId) => {
        setSelectedEmployees(prev => {
            const prevObj = prev.find(sel => sel.genericShiftId === genericShiftId);
            const filtered = prev.filter(sel => sel.genericShiftId !== genericShiftId);


            if (!employeeId && prevObj && prevObj.employeeId) {
                handleSendEmployeeToApi({ employeeId: null, shiftRoleId: genericShiftId });
                return filtered;
            }
            if (!employeeId) return filtered;
            return [...filtered, { employeeId, genericShiftId }];
        });
    };

    const employeeCounts = selectedEmployees.reduce((acc, obj) => {
        if (obj.employeeId) acc[obj.employeeId] = (acc[obj.employeeId] || 0) + 1;
        return acc;
    }, {});
    const isEmployeeRepeated = (employeeId) => employeeCounts[employeeId] > 1;

    const handleGetConfig = () => {
        const config = {
            cycle: ciclo,
            startDate: range.start,
            endDate: range.end,
            selectedEmployees
        };
        setConfig(config);
        handleCreateByGeneric(config)
    }

    useEffect(() => {
        if (defaultRoles && defaultRoles.length > 0 && selectedEmployees.length === 0) {
            setSelectedEmployees(
                defaultRoles.map(dr => ({
                    employeeId: dr.employeeId,
                    genericShiftId: dr.shiftRoleId
                }))
            );
        }
    }, [defaultRoles]);

    const handleSendEmployeeToApi = async (role) => {
        const payload = {
            ...role,
            employeeId: role.employeeId === "" ? null : role.employeeId,
            shiftRoleId: role.shiftRoleId === "" ? null : role.shiftRoleId
        };

        if (!payload.shiftRoleId) return;
        try {
            await saveDefaultRole(payload);
            console.log("Enviado correctamente:", payload);
        } catch (error) {
            console.error("Error enviando datos:", error);
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 py-8 mt-16 flex justify-center">
            <div className="w-2/3">
                <div className="flex flex-wrap items-center gap-4 p-4 ">
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
                                <th scope="col" className="px-6 py-3 flex items-center gap-2">
                                    Empleado
                                    <button
                                        onClick={() => setSelectedEmployees([])}
                                        className="ml-2 p-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                                        aria-label="Resetear selección de empleados"
                                        type="button"
                                        tabIndex={0}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="icon icon-tabler icons-tabler-outline icon-tabler-eraser-off"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 3l18 18" />
                                            <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l5 -4.993m2.009 -2.01l3 -3a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41c-1.417 1.431 -2.406 2.432 -2.97 3m-2.02 2.043l-4.211 4.256" />
                                            <path d="M18 13.3l-6.3 -6.3" />
                                        </svg>
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((row) => {
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
                                        <td className="px-6 py-4 flex items-center gap-4">
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
                                            <button
                                                type="button"
                                                onClick={() => handleSendEmployeeToApi({ employeeId: selectedId, shiftRoleId: row.id })}
                                                className="p-1 rounded-full transition-colors duration-200 border border-transparent bg-blue-400 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                                                aria-label="Asignar empleado a turno"
                                                tabIndex={0}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="icon icon-tabler icons-tabler-outline icon-tabler-settings-check"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M11.445 20.913a1.665 1.665 0 0 1 -1.12 -1.23a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.31 .318 1.643 1.79 .997 2.694" />
                                                    <path d="M15 19l2 2l4 -4" />
                                                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                                </svg>
                                            </button>
                                            <label className="inline-flex items-center cursor-pointer relative">
                                                <input
                                                    type="checkbox"
                                                    checked={row.active}
                                                    onChange={() => handleToggle(row.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600"></div>
                                                <span
                                                    className="absolute top-0.5 left-0.5 h-5 w-5 bg-white border border-gray-300 rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5"
                                                ></span>
                                            </label>

                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
