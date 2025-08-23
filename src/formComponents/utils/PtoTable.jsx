export const PtoTable = ({ employeePto }) => {
    // Función para calcular los días entre dos fechas (incluyendo ambos días)
    const getDaysBetween = (start, end) => {
        if (!start || !end) return "-";
        const startDate = new Date(start);
        const endDate = new Date(end);
        // Diferencia en milisegundos
        const diff = endDate - startDate;
        // Convertir a días y sumar 1 para incluir ambos extremos
        return diff >= 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) + 1 : "-";
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full w-auto table-auto">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-700">Fecha de Inicio</th>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-700">Fecha de Fin</th>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-700">Días</th>
                        <th className="px-2 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {employeePto.map((pto) => (
                        <tr key={pto.id} className="border-b hover:bg-gray-50">
                            <td className="px-2 py-2 whitespace-nowrap">{pto.startDate}</td>
                            <td className="px-2 py-2 whitespace-nowrap">{pto.terminationDate || "N/A"}</td>
                            <td className="px-2 py-2">
                                {getDaysBetween(pto.startDate, pto.terminationDate)}
                            </td>
                            <td className="px-2 py-2">{pto.absenceReason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
