

export const DistributionBar = ({ day }) => {
    let sumaPorIndice = new Array(day.employees[0].workShift.length).fill(0);

    // Iterar sobre los empleados y sumar los valores por índice
    day.employees.forEach(empleado => {
        empleado.workShift.forEach((workShift, indice) => {
            // Sumar 1 si el valor es distinto de "Null"
            if (workShift !== "Null" && workShift !== "PTO") {
                sumaPorIndice[indice] += 1;
            }
        });
    });


    return (
        <tr>
            <td className="sm:text-base text-xs font-semibold text-gray-800"></td>
            <td className="sm:text-base text-xs font-semibold text-gray-800"></td>
            {sumaPorIndice.map((valor, indice) => (
                <td
                    className="w-2 p-0 m-0 truncate text-center sm:text-base text-xs"
                    key={indice}
                >
                    <span className="font-sans font-semibold sm:text-base text-xs">{valor}</span>
                </td>
            ))}
            <td></td>
        </tr>
    );
};
