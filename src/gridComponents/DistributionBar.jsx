export const DistributionBar = ({ day }) => {
    let sumaPorIndice = new Array(day.employees[0].horas.length).fill(0);

    // Iterar sobre los empleados y sumar los valores por índice
    day.employees.forEach(empleado => {
        empleado.horas.forEach((horas, indice) => {
          // Sumar 1 si el valor es distinto de 0
          if (horas !== 0) {
            sumaPorIndice[indice] += 1;
          }
        });
    });


    return (
        <tr>
            <td className="text-base font-semibold text-gray-800"></td>
            <td className="text-base font-semibold text-gray-800"></td>
            {sumaPorIndice.map((valor, indice) => (
                <td
                    className="w-2 p-0 m-0 truncate"
                    key={indice} // Usamos `indice` como clave única
                >
                    <span>{valor}</span>
                </td>
            ))}
            <td></td>
        </tr>
    );
};
