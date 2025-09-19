export const DispTable = ({ workHours, handleDeleteDisponibility }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Inicio</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Fin</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {workHours.map((workHour) => (
                        <tr key={workHour.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">{workHour.date}</td>
                            <td className="px-4 py-2">{workHour.startHour || "N/A"}</td>
                            <td className="px-4 py-2">{workHour.terminationHour || "N/A"}</td>
                            <td className="px-4 py-2">{workHour.absenceReason}</td>
                            <td className="px-4 py-2"><button onClick={() => handleDeleteDisponibility(workHour.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash text-red-500"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
