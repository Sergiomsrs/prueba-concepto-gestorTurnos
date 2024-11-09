import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";


export const Resumen = () => {
  const { data, selectedOption } = useContext(AppContext);

  // Creamos un Set para almacenar nombres únicos de empleados
  const employeeNamesSet = new Set();

  // Iteramos sobre cada día en el array data
  data.forEach(day => {
    // Iteramos sobre cada empleado en el día actual
    day.employees.forEach(employee => {
      // Agregamos el nombre del empleado al Set
      employeeNamesSet.add(employee.name);
    });
  });

  // Convertimos el Set a un array, si necesitas el resultado en formato array
  const uniqueEmployeeNames = Array.from(employeeNamesSet);

  // Función para calcular la duración total en formato decimal
  const getTotalShiftDuration = (employeeName) => {
    let totalMinutes = 0;

    // Iteramos sobre los días para obtener la duración de cada turno del empleado
    data.forEach(day => {
      const employee = day.employees.find(emp => emp.name === employeeName);
      if (employee && employee.shiftDuration) {
        // Aquí asumimos que shiftDuration está en formato "HH:mm"
        const [hours, minutes] = employee.shiftDuration.split(":").map(Number);
        totalMinutes += hours * 60 + minutes; // Convertimos todo a minutos
      }
    });

    // Convertimos los minutos totales a horas decimales
    const totalHoursDecimal = totalMinutes / 60;
    return totalHoursDecimal.toFixed(2); // Retornamos con dos decimales
  };

  return (
    <table className="table table-hover text-center table-fixed">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>wwh</th>
          <th>Total</th>
          <th>Var</th>
        </tr>
      </thead>
      <tbody>
        {uniqueEmployeeNames.map(employeeName => {
          // Calculamos las horas trabajadas (wwh) para cada empleado
          const wwh = data
            .flatMap(day => day.employees)
            .find(employee => employee.name === employeeName)?.wwh || 0;

          // Calculamos la duración total de los turnos del empleado
          const totalShiftDuration = getTotalShiftDuration(employeeName);

          // Calculamos la variación entre wwh y totalShiftDuration
          const variation = wwh - totalShiftDuration;

          // Condición para mostrar la fila de acuerdo al filtro de teamWork
          return (
            (selectedOption === "todos" || selectedOption === 
              data.flatMap(day => day.employees).find(employee => employee.name === employeeName)?.teamWork) && (
              <tr key={employeeName}>
                <td>{employeeName}</td>
                <td>{wwh}</td>
                <td>{totalShiftDuration}</td>
                <td>{variation.toFixed(2)}</td> {/* Muestra la variación con dos decimales */}
              </tr>
            )
          );
        })}
      </tbody>
    </table>
  );
};