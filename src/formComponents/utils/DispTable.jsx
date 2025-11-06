import { TrashIcon } from "../../components/icons/TrashIcon";

export const DispTable = ({ workHours, handleDeleteDisponibility }) => {
    return (
        <div className="space-y-2">
            {workHours.map((workHour) => (
                <div key={workHour.id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-gray-300 transition-all duration-200">

                    {/* Primera línea: Fecha, horario y botón */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                                <span className="text-sm font-semibold text-gray-900">
                                    {workHour.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs text-gray-600">
                                    {workHour.startHour || "N/A"} - {workHour.terminationHour || "N/A"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDeleteDisponibility(workHour.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200 flex-shrink-0"
                            title="Eliminar registro"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Segunda línea: Motivo */}
                    <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs text-gray-600 truncate">
                            {workHour.absenceReason}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
