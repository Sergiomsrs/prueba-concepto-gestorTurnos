export const DispTable = ({workHours}) => {
  return (
     <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Inicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Fin</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {workHours.map((workHour) => (
                                <tr key={workHour.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap">{workHour.date}</td>
                                    <td className="px-4 py-2">{workHour.startHour || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.terminationHour || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.absenceReason}</td>
                                    <td className="px-4 py-2">
                                        <button
                                        onClick={()=>handleDeleteDisp(workHour.id, workHour.date)}
                                        className="rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white"
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
  )
}
