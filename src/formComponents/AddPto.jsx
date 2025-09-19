import { useState } from "react";

import { useEmployees } from "../Hooks/useEmployees";
import { TrashIcon } from "../components/icons/TrashIcon";

export const AddPto = () => {

    const {
        allEmployees,
        message,
        ptoCreateForm,
        ptoList,

        handleDeletePto,
        handlePtoEmployeeSelect,
        handleSavePto,
        setPtoList,
    } = useEmployees();

    const [newPto, setNewPto] = useState({ ptoStartDate: "", ptoTerminationDate: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleSavePto({
            employeeId: ptoCreateForm.id,
            absenceReason: newPto.absenceReason,
            startDate: newPto.ptoStartDate,
            terminationDate: newPto.ptoTerminationDate,
        });

        setNewPto({ ptoStartDate: "", ptoTerminationDate: "", absenceReason: "" });
    };


    return (
        <form className="space-y-6">
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-col gap-4 mb-4">
                <label htmlFor="employee-select" className="text-sm font-medium text-gray-700">Seleccionar Empleado</label>
                <select
                    id="employee-select"
                    onChange={e => handlePtoEmployeeSelect(e.target.value, allEmployees, setPtoList)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5"
                >
                    <option value="">-- Seleccione un empleado --</option>
                    {allEmployees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} {employee.lastName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Mensaje */}
            {message && <p className="text-red-500 text-sm">{message}</p>}

            {/* Tabla de jornadas */}
            {ptoList.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Inicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Término</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {ptoList.map((workHour) => (
                                <tr key={workHour.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{workHour.startDate}</td>
                                    <td className="px-4 py-2">{workHour.terminationDate || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.absenceReason}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDeletePto(workHour.id, workHour.startDate, workHour.terminationDate)}
                                        ><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Formulario para añadir nueva jornada */}
            <div className="mt-6 space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-900">Añadir Nueva Ausencia</h3>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3 mb-4">
                        <label htmlFor="absenceReason" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ausencia</label>
                        <input
                            type="text"
                            name="absenceReason"
                            id="absenceReason"
                            value={newPto.absenceReason}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="ptoStartDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="ptoStartDate"
                            id="ptoStartDate"
                            value={newPto.ptoStartDate}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="ptoTerminationDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                        <input
                            type="date"
                            name="ptoTerminationDate"
                            id="ptoTerminationDate"
                            value={newPto.ptoTerminationDate}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                    <button onClick={handleSubmit} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>
                </div>
            </div>
        </form>
    );
};
