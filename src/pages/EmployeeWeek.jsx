import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { EmployeePicker } from "../utilComponents/EmployeePicker";
import { findMinMaxOfBlocks, getStringBlock, splitIntoBlocks } from "../utils/blockHours";
import { formatDate, formatToDate } from "../utils/function";

export const EmployeeWeek = () => {
  const { data } = useContext(AppContext);
  
  const [selectedEmployee, setSelectedEmployee] = useState(data[0].employees[0].name);

  
  // Selección de empleado
  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
  };
  
  
  // Obtener array de workShift del empleado seleccionado
  const empleadoData = data.slice(1, data.length+1).map(day => ({
    id: day.id,
    day: day.day,
    workShift: day.employees.find(emp => emp.name === selectedEmployee)?.workShift || [],
    duration: day.employees.find(emp => emp.name === selectedEmployee)?.shiftDuration || "00:00",
  }));

  const wwh = Math.round(
    (data.slice(1).reduce((acc, day) => {
        const employee = day.employees.find(emp => emp.name === selectedEmployee);
        if (employee) {
            return acc + (employee.wwh / 7);
        }
        return acc;
    }, 0) * 2) / 2
);

const totalShiftDuration = empleadoData.reduce((acc, day) => {
  const [hours, minutes] = day.duration.split(":").map(Number);
  return acc + (hours * 60 + minutes);  // Sumar el total de minutos
}, 0);

// Convertir el total de minutos a horas y minutos
const totalHours = Math.floor(totalShiftDuration / 60);
const totalMinutes = totalShiftDuration % 60;

// Formatear el resultado en el formato "00:00"
const formattedTime = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}`;

console.log(formattedTime);

console.log(wwh- formattedTime);

//nuevo codigo

// 1. Obtener el valor de wwh (ya lo tienes calculado en horas)
const wwhs = Math.round(
  (data.slice(1).reduce((acc, day) => {
    const employee = day.employees.find(emp => emp.name === selectedEmployee);
    if (employee) {
      return acc + (employee.wwh / 7);  // Asumiendo que wwh está en horas
    }
    return acc;
  }, 0) * 2) / 2
);

// 2. Calcular el total de horas trabajadas en minutos
const totalShiftDurations = empleadoData.reduce((acc, day) => {
  const [hours, minutes] = day.duration.split(":").map(Number);
  return acc + (hours * 60 + minutes);  // Convertir todo a minutos
}, 0);

// 3. Convertir el valor de wwh a minutos para poder restarlo
const wwhInMinutes = wwh * 60; // Convertir wwh de horas a minutos

// 4. Realizar la resta de las horas trabajadas (en minutos) con las horas base (wwh en minutos)
const differenceInMinutes = totalShiftDuration - wwhInMinutes;

// 5. Convertir la diferencia en minutos a horas y minutos
const differenceHours = Math.floor(differenceInMinutes / 60);
const differenceMinutes = differenceInMinutes % 60;

// 6. Formatear el resultado en formato "00:00"
const formattedDifference = `${differenceHours.toString().padStart(2, '0')}:${differenceMinutes.toString().padStart(2, '0')}`;

console.log(formattedDifference);

//-------------------
   
  
  console.log(empleadoData);

  return (
    <section className="w-3/4">
  <EmployeePicker value={selectedEmployee} onChange={handleEmployeeChange} />

  <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 text-sm font-bold text-white ring-1 ring-inset ring-gray-500/10 mb-4">
    {`Semana del ${empleadoData[0].id} al ${empleadoData[empleadoData.length - 1].id}`}
  </span>

  <div className="border rounded-lg shadow-md overflow-x-auto p-2">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno de Trabajo</th>
          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {empleadoData.map((day, index) => {
          const { workShift } = day;
          const blocks = splitIntoBlocks(workShift);
          const minMaxValues = findMinMaxOfBlocks(blocks);

          return (
            <tr key={index}>
              <td className="px-4 py-2 w-6 whitespace-nowrap text-sm font-medium text-gray-900">{formatToDate(day)}</td>
              <td className="px-4 py-2 w-6 whitespace-nowrap text-sm font-medium text-gray-900">{`${day.day.charAt(0).toUpperCase() + day.day.slice(1)}`}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{getStringBlock(day, minMaxValues)}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{day.duration}</td>
            </tr>
          );
        })}
        
        {/* Fila con los resultados finales */}
        <tr>
          <td className="px-4 py-2 w-6 whitespace-nowrap text-sm font-medium text-gray-900">Totales</td>
          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Jornada: {wwh}h</td>
          <td className="px-4 py-2 w-6 whitespace-nowrap text-sm font-medium text-gray-900">Trabajadas: {formattedTime}</td>
          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500">Complementarias: {formattedDifference}</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
  );
};
