import { useState } from "react";
import { DispTable } from "./utils/DispTable";
import { useEmployees } from "../Hooks/useEmployees";

const newDisponibilityInititalState = { employeeId: "", absenceReason: "", date: "", startHour: "", terminationHour: "" };

export const AddDisp = () => {

    const {
        allEmployees,
        createForm,
        message,
        workHours,

        handleEmployeeSelect,
        handleDeleteDisponibility,
        handleSaveDisponibility,
    } = useEmployees();

    const [newDisponibility, setNewDisponibility] = useState(newDisponibilityInititalState);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDisponibility(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleSaveDisponibility({
                employeeId: createForm.id,
                absenceReason: newDisponibility.absenceReason,
                date: newDisponibility.date,
                startHour: newDisponibility.startHour,
                terminationHour: newDisponibility.terminationHour,
            });
            setNewDisponibility(newDisponibilityInititalState)
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <form className="space-y-6">
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-col gap-4 mb-4">
                <label htmlFor="employee-select" className="text-sm font-medium text-gray-700">Seleccionar Empleado</label>
                <select
                    id="employee-select"
                    onChange={e => handleEmployeeSelect(e.target.value, allEmployees)}
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
            {workHours.length > 0 && (
                <DispTable workHours={workHours} handleDeleteDisponibility={handleDeleteDisponibility} />
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
                            value={newDisponibility.absenceReason}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={newDisponibility.date}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-2">Hora de Inicio</label>
                        <input
                            type="time"
                            name="startHour"
                            id="startHour"
                            value={newDisponibility.startHour}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="terminationHour" className="block text-sm font-medium text-gray-700 mb-2">Hora de Fin</label>
                        <input
                            type="time"
                            name="terminationHour"
                            id="terminationHour"
                            value={newDisponibility.terminationHour}
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
