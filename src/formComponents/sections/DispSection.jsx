import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEmployees } from '../../Hooks/useEmployees';
import { fetchDisponibilities } from '../../services/employees';
import { dispMockData } from '../../utils/apiMock';
import { AuthContext } from '@/timeTrack/context/AuthContext';
import { TrashIcon } from '../../components/icons/TrashIcon';


export const DispSection = ({ employeeId }) => {
    const { auth } = useContext(AuthContext);
    const isDemo = auth?.token === "demo-token-12345";

    const {
        message,
        handleDeleteDisponibility,
        handleSaveDisponibility,
    } = useEmployees(employeeId);

    const [dispForm, setDispForm] = useState({
        date: '',
        startHour: '',
        terminationHour: '',
        absenceReason: '',
    });

    const { data: workHours = [], isLoading, error } = useQuery({
        queryKey: ["disponibilities", employeeId],
        queryFn: async () => {
            const { status, data } = await fetchDisponibilities.getDisponibilities(employeeId);
            return status === 204 ? [] : data;
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
        initialData: isDemo ? dispMockData : undefined,
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDispForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dispForm.date || !dispForm.startHour || !dispForm.terminationHour) {
            return;
        }

        try {
            await handleSaveDisponibility({
                employeeId,
                date: dispForm.date,
                startHour: dispForm.startHour,
                terminationHour: dispForm.terminationHour,
                absenceReason: dispForm.absenceReason || 'Disponibilidad',
            });

            setDispForm({
                date: '',
                startHour: '',
                terminationHour: '',
                absenceReason: '',
            });
        } catch (error) {
            console.error('Error al guardar disponibilidad:', error);
        }
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return '-';
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const duration = endH - startH + (endM - startM) / 60;
        return `${duration.toFixed(1)}h`;
    };

    return (
        <div className="space-y-4">
            {/* Error handling */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 animate-fade-in">
                    <p className="text-sm font-medium text-red-700">Error al cargar datos: {error.message}</p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 animate-fade-in">
                    <p className="text-sm font-medium text-blue-700">Cargando disponibilidades...</p>
                </div>
            )}

            {/* Tabla de disponibilidades registradas */}
            {workHours && workHours.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Disponibilidades Registradas</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fecha</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Inicio</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fin</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Duración</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Motivo</th>
                                    <th className="px-3 py-2 text-center font-medium text-gray-700">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workHours.map((disp) => (
                                    <tr key={disp.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-3 py-2 text-gray-900">{disp.date}</td>
                                        <td className="px-3 py-2 text-gray-600">{disp.startHour}</td>
                                        <td className="px-3 py-2 text-gray-600">{disp.terminationHour}</td>
                                        <td className="px-3 py-2 font-medium text-gray-900">
                                            {calculateDuration(disp.startHour, disp.terminationHour)}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">{disp.absenceReason}</td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => handleDeleteDisponibility(disp.id)}
                                                className="inline-flex hover:text-red-600 transition-colors"
                                                title="Eliminar"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Formulario para agregar nueva disponibilidad */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">Registrar Nueva Disponibilidad</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={dispForm.date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="absenceReason" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Disponibilidad
                        </label>
                        <input
                            type="text"
                            id="absenceReason"
                            name="absenceReason"
                            placeholder="Ej: Disponibilidad parcial"
                            value={dispForm.absenceReason}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de Inicio
                        </label>
                        <input
                            type="time"
                            id="startHour"
                            name="startHour"
                            value={dispForm.startHour}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="terminationHour" className="block text-sm font-medium text-gray-700 mb-1">
                            Hora de Fin
                        </label>
                        <input
                            type="time"
                            id="terminationHour"
                            name="terminationHour"
                            value={dispForm.terminationHour}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={() => setDispForm({
                            date: '',
                            startHour: '',
                            terminationHour: '',
                            absenceReason: '',
                        })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Guardar Disponibilidad
                    </button>
                </div>
            </form>
        </div>
    );
};
