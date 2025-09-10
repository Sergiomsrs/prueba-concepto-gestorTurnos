import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { formatTime, uniqueEmployeeName } from "../utils/function";
import { daysOfWeek } from "../utils/data";

export const RDias = ({ data }) => {
  const { selectedOption, holidayDates } = useContext(AppContext);
  const uniqueEmployeeNames = uniqueEmployeeName(data);  // Obtenemos los empleados únicos

  const dataWeek = useMemo(() => data.slice(1, data.length), [data]);

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
    <table className="table table-hover text-center w-2/3 mb-0">
      <thead>
        <tr>
          {dataWeek.map((item) => {
            const day = item.day
              ? item.day.charAt(0).toUpperCase() + item.day.slice(1)
              : daysOfWeek[item.id]; // fallback con el id numérico

            return (
              <th key={item.id} className="whitespace-nowrap">
                {day}
                <span className="text-xs">
                  {` ${typeof item.id === "string" ? `(${item.id.slice(8)})` : ""}`}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {uniqueEmployeeNames.map((employeeName) => {
          const teamWork = getEmployeeTeamWork(employeeName);  // Obtenemos el `teamWork` de cada empleado

          // Mostramos el empleado solo si debe ser incluido según el `selectedOption`
          if (selectedOption === "todos" || selectedOption === teamWork) {
            return (
              <tr key={employeeName} >
                {dataWeek.map((item) => (

                  <td key={item.id} className="whitespace-nowrap">
                    {formatTime(item.employees.find((e) => e.name === employeeName)?.shiftDuration)}{holidayDates.includes(item.id) ? "🎉" : ""}
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