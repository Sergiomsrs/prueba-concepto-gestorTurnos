import { useMemo, useState } from "react"
import { useEmployees } from "../Hooks/useEmployees";
import { useEmployeeConditions } from "../Hooks/useEmployeeConditions";
import { TrashIcon } from "../components/icons/TrashIcon";
import { usePublicHolidays } from "../Hooks/usePublicHolidays";


const initialState = {
    id: null,
    date: "",
    type: "",
    description: "",
    paid: "SI"
};

export const AddPublicHolidays = () => {


    const [newDay, setNewDay] = useState(initialState);

    const { publicHolidays, message, handleSavePh, handleDeletePh } = usePublicHolidays();


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDay(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitPublicHolidays = (e) => {
        e.preventDefault();

        /*if (!newTeamWork.teamWork || !newTeamWork.twStartDate) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }*/

        handleSavePh(newDay.id, newDay.date, newDay.type, newDay.description, newDay.paid)
        setNewDay(initialState)
    };

    return (
        <form className="space-y-6">


            {message && (
                <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 shadow-sm animate-fade-in">
                    <p className="text-sm font-medium text-violet-700">
                        {message}
                    </p>
                </div>
            )}


            {/* Formulario para añadir nueva jornada */}
            <div className="mt-6 space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-900">Añadir Dias Festivos</h3>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                            type="date"
                            name="date"
                            id="dateId"
                            value={newDay.date}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 px-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="tipo"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Origen
                        </label>

                        <select
                            name="type"
                            id="tipo"
                            value={newDay.type}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm
               focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500
               sm:text-sm py-1.5 pl-2"
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="LEGAL">Legal</option>
                            <option value="COMPANY">Empresa</option>
                            <option value="EXCEPTIONAL">Excepcional</option>
                        </select>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                        <input

                            name="description"
                            id="descripcionId"
                            value={newDay.description}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">Remuneración</label>
                        <select

                            name="paid"
                            id="paidId"
                            value={newDay.paid}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        >
                            <option value="SI">Si</option>
                            <option value="NO">No</option>

                        </select>

                    </div>

                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>

                    <button onClick={handleSubmitPublicHolidays} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>

                </div>

            </div>

            {/* Tabla de jornadas */}
            {publicHolidays.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Remunerado</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {publicHolidays.map((ph) => (
                                <tr key={ph.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{ph.date}</td>
                                    <td className="px-4 py-2">{ph.type || "N/A"}</td>
                                    <td className="px-4 py-2">{ph.description}</td>
                                    <td className="px-4 py-2">{ph.paid == true ? "Si" : "NO"}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePh(ph.id)}
                                        ><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </form>
    );
};
