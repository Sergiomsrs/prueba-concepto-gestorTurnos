import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { getTotalShiftDuration, uniqueEmployeeName } from "../utils/function";


export const Resumen = ({ data }) => {
  const { selectedOption, holidayDates } = useContext(AppContext);

  const uniqueEmployeeNames = uniqueEmployeeName(data);


  return (
    <table className="table table-fixed table-hover text-center w-1/3 mb-0">
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

              // Verificar si el día es festivo
              const isHoliday = holidayDates.includes(day.id);

              // Solo sumar las horas si el día no es festivo y el empleado existe
              if (employee && !isHoliday) {
                return acc + (employee.wwh / 7);
              }
              return acc;
            }, 0) * 2) / 2
          );

          const totalShiftDuration = getTotalShiftDuration(employeeNameTrimmed, data);

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