import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEmployeeConditions } from '../../Hooks/useEmployeeConditions';
import { fetchConditions } from '../../services/wwhService';
import { wwhMockData } from '../../utils/apiMock';
import { AuthContext } from '@/timeTrack/context/AuthContext';
import { TrashIcon } from '../../components/icons/TrashIcon';


export const WwhSection = ({ employeeId }) => {
    const { auth } = useContext(AuthContext);
    const isDemo = auth?.token === "demo-token-12345";

    const {
        newWorkHours,
        message,
        setMessage,
        setNewWorkHours,
        handleSaveWwh,
        handleDeleteWwh,
    } = useEmployeeConditions(employeeId);


    const { data: workHours = [], isLoading, error } = useQuery({
        queryKey: ["wwh", employeeId],
        queryFn: () => fetchConditions.getWwhByEmployee(employeeId),
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
        initialData: isDemo ? wwhMockData : undefined,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkHours(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newWorkHours.weeklyWorkHoursData || !newWorkHours.wwhStartDate) {
            setMessage('Por favor, completa todos los campos.');
            return;
        }
        handleSaveWwh(
            employeeId,
            newWorkHours.weeklyWorkHoursData,
            newWorkHours.wwhStartDate
        );
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
                    <p className="text-sm font-medium text-blue-700">Cargando jornadas...</p>
                </div>
            )}

            {/* Mensaje de estado */}
            {message && (
                <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 animate-fade-in">
                    <p className="text-sm font-medium text-violet-700">{message}</p>
                </div>
            )}

            {/* Tabla de jornadas existentes */}
            {workHours && workHours.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Jornadas Registradas</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Inicio</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fin</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Horas/Semana</th>
                                    <th className="px-3 py-2 text-center font-medium text-gray-700">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workHours.map((wh) => (
                                    <tr key={wh.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-3 py-2 text-gray-900">{wh.wwhStartDate}</td>
                                        <td className="px-3 py-2 text-gray-600">{wh.wwhTerminationDate || 'Vigente'}</td>
                                        <td className="px-3 py-2 font-semibold text-gray-900">{wh.weeklyWorkHoursData}h</td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => handleDeleteWwh(wh.id)}
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

            {/* Formulario para agregar nueva jornada */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">Agregar Nueva Jornada</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="weeklyWorkHoursData" className="block text-sm font-medium text-gray-700 mb-1">
                            Horas por Semana
                        </label>
                        <input
                            type="number"
                            id="weeklyWorkHoursData"
                            name="weeklyWorkHoursData"
                            placeholder="40"
                            value={newWorkHours.weeklyWorkHoursData || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="wwhStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            id="wwhStartDate"
                            name="wwhStartDate"
                            value={newWorkHours.wwhStartDate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={() => setNewWorkHours({ weeklyWorkHoursData: '', wwhStartDate: '' })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Guardar Jornada
                    </button>
                </div>
            </form>
        </div>
    );
};
