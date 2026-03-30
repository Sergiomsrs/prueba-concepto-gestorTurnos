import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEmployees } from '../../Hooks/useEmployees';
import { fetchPto } from '../../services/employees';
import { TrashIcon } from '../../components/icons/TrashIcon';

/**
 * PtoSection
 * Componente para gestionar ausencias (Paid Time Off) del empleado seleccionado
 * Los datos ya están precargados
 */
export const PtoSection = ({ employeeId }) => {
    const {
        message,
        handleDeletePto,
        handleSavePto,
    } = useEmployees(employeeId);

    const [ptoForm, setPtoForm] = useState({
        absenceReason: '',
        ptoStartDate: '',
        ptoTerminationDate: '',
    });

    // Usar query que ya está precargada
    const { data: ptoList = [], isLoading, error } = useQuery({
        queryKey: ["pto", employeeId],
        queryFn: async () => {
            const { status, data } = await fetchPto.getPtoList(employeeId);
            return status === 204 ? [] : data;
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
    });

    // Debug: loguear datos
    console.log('[PtoSection] employeeId:', employeeId, 'ptoList:', ptoList, 'isLoading:', isLoading, 'error:', error);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPtoForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ptoForm.absenceReason || !ptoForm.ptoStartDate || !ptoForm.ptoTerminationDate) {
            return;
        }

        await handleSavePto({
            employeeId,
            absenceReason: ptoForm.absenceReason,
            startDate: ptoForm.ptoStartDate,
            terminationDate: ptoForm.ptoTerminationDate,
        });

        setPtoForm({
            absenceReason: '',
            ptoStartDate: '',
            ptoTerminationDate: '',
        });
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
                    <p className="text-sm font-medium text-blue-700">Cargando ausencias...</p>
                </div>
            )}

            {/* Tabla de ausencias registradas */}
            {ptoList && ptoList.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Ausencias Registradas</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Tipo</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Inicio</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fin</th>
                                    <th className="px-3 py-2 text-center font-medium text-gray-700">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ptoList.map((pto) => (
                                    <tr key={pto.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-3 py-2 font-medium text-gray-900">{pto.absenceReason}</td>
                                        <td className="px-3 py-2 text-gray-600">{pto.startDate}</td>
                                        <td className="px-3 py-2 text-gray-600">{pto.terminationDate}</td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => handleDeletePto(pto.id, pto.startDate, pto.terminationDate)}
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

            {/* Formulario para agregar nueva ausencia */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">Registrar Nueva Ausencia</h4>

                <div>
                    <label htmlFor="absenceReason" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Ausencia
                    </label>
                    <select
                        id="absenceReason"
                        name="absenceReason"
                        value={ptoForm.absenceReason}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                    >
                        <option value="">-- Selecciona tipo --</option>
                        <option value="Vacaciones">Vacaciones</option>
                        <option value="Enfermedad">Enfermedad</option>
                        <option value="Permiso Personal">Permiso Personal</option>
                        <option value="Duelo">Duelo</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ptoStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            id="ptoStartDate"
                            name="ptoStartDate"
                            value={ptoForm.ptoStartDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="ptoTerminationDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Fin
                        </label>
                        <input
                            type="date"
                            id="ptoTerminationDate"
                            name="ptoTerminationDate"
                            value={ptoForm.ptoTerminationDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={() => setPtoForm({
                            absenceReason: '',
                            ptoStartDate: '',
                            ptoTerminationDate: '',
                        })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Guardar Ausencia
                    </button>
                </div>
            </form>
        </div>
    );
};
