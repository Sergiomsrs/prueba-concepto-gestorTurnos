import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { uniqueEmployeeName } from "../utils/function";


export const Resumen = () => {
  const { data, selectedOption } = useContext(AppContext);

  const uniqueEmployeeNames = uniqueEmployeeName(data);

  // Función para calcular la duración total en formato decimal
  const getTotalShiftDuration = (employeeName) => {
    let totalMinutes = 0;

    // Iteramos sobre los días para obtener la duración de cada turno del empleado
    data.forEach(day => {
      const employee = day.employees.find(emp => emp.name === employeeName);
      if (employee && employee.shiftDuration) {
        const [hours, minutes] = employee.shiftDuration.split(":").map(Number);
        totalMinutes += hours * 60 + minutes; // Convertimos todo a minutos
      }
    });

    const totalHoursDecimal = totalMinutes / 60;
    return totalHoursDecimal.toFixed(2);
  };

  return (
    <table className="table table-hover text-center w-1/3 mb-0">
      <thead>
        <tr>
          <th className="text-left">Empleado</th>
          <th>wwh</th>
          <th>Total</th>
          <th>Var</th>
        </tr>
      </thead>
      <tbody>
        {uniqueEmployeeNames.map(employeeName => {
          const employeeNameTrimmed = employeeName.trim(); // Limpiar espacios
          const wwh = Math.round(
            (data.slice(1).reduce((acc, day) => {
                const employee = day.employees.find(emp => emp.name === employeeNameTrimmed);
                if (employee) {
                    return acc + (employee.wwh / 7);
                }
                return acc;
            }, 0) * 2) / 2
        );

          const totalShiftDuration = getTotalShiftDuration(employeeNameTrimmed);

          const variation = wwh - totalShiftDuration;

          // Filtramos por equipo de trabajo si se ha seleccionado un filtro
          const selectedEmployeeTeam = data
            .flatMap(day => day.employees)
            .find(employee => employee.name === employeeNameTrimmed)?.teamWork;

          return (
            (selectedOption === "todos" || selectedOption === selectedEmployeeTeam) && (
              <tr key={employeeNameTrimmed}>
                <td className="text-left">{employeeNameTrimmed}</td>
                <td>{wwh}</td>
                <td>{totalShiftDuration}</td>
                <td>{variation.toFixed(2)}</td> 
              </tr>
            )
          );
        })}
      </tbody>
    </table>
  );
};