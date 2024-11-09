import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { formatTime, uniqueEmployeeName } from "../utils/function";

export const RDias = () => {
  const { data, selectedOption } = useContext(AppContext);
  const uniqueEmployeeNames = uniqueEmployeeName(data);  // Obtenemos los empleados únicos

  useEffect(() => {}, [data]);

  const dataWeek = useMemo(() => data.slice(1, data.length), [data]);

  const empleados = useMemo(() => {
    if (dataWeek.length > 0) {
      return dataWeek[0].employees;  // Tomamos los empleados del primer día
    }
    return [];
  }, [dataWeek]);

  // Función para obtener el `teamWork` de un empleado (en cualquiera de los días)
  const getEmployeeTeamWork = (employeeName) => {
    // Buscamos en todos los días de la semana el `teamWork` del empleado
    for (let i = 0; i < dataWeek.length; i++) {
      const employee = dataWeek[i].employees.find((e) => e.name === employeeName);
      if (employee) {
        return employee.teamWork;  // Devolvemos el `teamWork` del primer día en el que aparece
      }
    }
    return null;  // Si no se encuentra al empleado, devolvemos null
  };

  return (
    <table className="table table-hover text-center w-2/3">
      <thead>
        <tr>
          {dataWeek.map((item) => (
            <th key={item.id}>{item.day.charAt(0).toUpperCase() + item.day.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {uniqueEmployeeNames.map((employeeName) => {
          const teamWork = getEmployeeTeamWork(employeeName);  // Obtenemos el `teamWork` de cada empleado

          // Mostramos el empleado solo si debe ser incluido según el `selectedOption`
          if (selectedOption === "todos" || selectedOption === teamWork) {
            return (
              <tr key={employeeName}>
                {dataWeek.map((item) => (
                  <td key={item.id}>
                    {formatTime(item.employees.find((e) => e.name === employeeName)?.shiftDuration)}
                  </td>
                ))}
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
  );
};