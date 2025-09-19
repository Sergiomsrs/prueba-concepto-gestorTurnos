import { useEffect, useState } from "react";
import { generatePtoNullWithDate, generatePtoWithDate, getDatesInRange } from "../utils/function";
import { generateWorkShiftPto } from "../utils/blockHours";
import { DispTable } from "./utils/DispTable";
import { useEmployees } from "../Hooks/useEmployees";
import { getEmployeesData } from "../services/employees";

export const AddDisp = () => {



    const {
        allEmployees,
        createForm,
        message,
        newPto,
        newPtoInicitalState,
        workHours,

        handleDeleteDisponibility,
        handleEmployeeSelect,
        handleSaveDisponibility,
        setNewPto,
    } = useEmployees();



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleSaveDisponibility({
                employeeId: createForm.id,
                absenceReason: newPto.absenceReason,
                date: newPto.date,
                startHour: newPto.startHour,
                terminationHour: newPto.terminationHour,
            });
            setNewPto(newPtoInicitalState)
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
                            value={newPto.absenceReason}
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
                            value={newPto.date}
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
                            value={newPto.startHour}
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
                            value={newPto.terminationHour}
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
