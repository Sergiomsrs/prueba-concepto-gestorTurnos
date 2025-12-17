import { useState } from "react"
import { useEmployeeConditions } from "../Hooks/useEmployeeConditions";
import { useEmployees } from "../Hooks/useEmployees";


export const AddWwh = () => {
    const initialState = { name: '', lastName: '', email: '', hireDate: '', terminationDate: '' };
    const [createForm, setCreateForm] = useState(initialState);

    const { allEmployees } = useEmployees();


    const {
        //Data
        message,
        workHours,
        newWorkHours,

        //Setters
        setMessage,
        setWorkHours,
        setNewWorkHours,

        //Handlers
        handleSaveWwh,
        handleGetWwhByEmployeeId

    } = useEmployeeConditions();


    const handleEmployeeSelect = (e) => {

        const selectedId = e.target.value;
        const selectedEmployee = allEmployees.find(emp => emp.id.toString() === selectedId);

        if (selectedEmployee) {
            setCreateForm(selectedEmployee);
            setMessage("");
            handleGetWwhByEmployeeId(selectedId)
        } else {
            setCreateForm(initialState);
            setWorkHours([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkHours(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitNewWorkHours = (e) => {
        e.preventDefault();
        if (!newWorkHours.weeklyWorkHoursData || !newWorkHours.wwhStartDate) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }
        handleSaveWwh(createForm.id, newWorkHours.weeklyWorkHoursData, newWorkHours.wwhStartDate)
    };


    return (
        <form className="space-y-6">
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-col gap-4 mb-4">
                <label htmlFor="employee-select" className="text-sm font-medium text-gray-700">Seleccionar Empleado</label>
                <select
                    id="employee-select"
                    onChange={handleEmployeeSelect}
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

            {message && (
                <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 shadow-sm animate-fade-in">
                    <p className="text-sm font-medium text-violet-700">
                        {message}
                    </p>
                </div>
            )}

            {/* Tabla de jornadas */}
            {workHours.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg animate-fade-in ">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Inicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Término</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Horas Semanales</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {workHours.map((workHour) => (
                                <tr key={workHour.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{workHour.wwhStartDate}</td>
                                    <td className="px-4 py-2">{workHour.wwhTerminationDate || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.weeklyWorkHoursData}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Formulario para añadir nueva jornada */}
            <div className="mt-6 space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-900">Añadir Nueva Jornada</h3>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3">
                        <label htmlFor="weeklyWorkHoursData" className="block text-sm font-medium text-gray-700 mb-2">Jornada (horas semanales)</label>
                        <input
                            type="number"
                            name="weeklyWorkHoursData"
                            id="weeklyWorkHoursData"
                            value={newWorkHours.weeklyWorkHoursData}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="wwhStartDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="wwhStartDate"
                            id="wwhStartDate"
                            value={newWorkHours.wwhStartDate}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>

                    <button onClick={handleSubmitNewWorkHours} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>

                </div>

            </div>
        </form>
    );
};
