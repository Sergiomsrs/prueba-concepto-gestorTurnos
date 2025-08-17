import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { EmployeePicker } from "../utilComponents/EmployeePicker";
import { getStringBlock, splitIntoBlocksByIndex, convertBlocksToTimes } from "../utils/blockHours";
import { formatToDate } from "../utils/function";

export const EmployeeWeek = () => {
  const { data, holidayDates } = useContext(AppContext);
  
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
      
      // Verificar si el día es festivo
      const isHoliday = holidayDates.includes(day.id);
  
      // Solo sumar las horas si el día no es festivo y el empleado existe
      if (employee && !isHoliday) {
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
    <section className="w-full max-w-6xl mx-auto px-2 mt-6">
  <EmployeePicker value={selectedEmployee} onChange={handleEmployeeChange} />

  <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 text-sm font-bold text-white ring-1 ring-inset ring-gray-500/10 mb-4">
    {`Semana del ${empleadoData[0].id} al ${empleadoData[empleadoData.length - 1].id}`}
  </span>

  {/* Tarjeta para Totales */}
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-t-4 border-blue-500">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Semana</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">Jornada</h4>
        <p className="text-xl font-bold text-gray-900">{wwh}h</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">Horas Trabajadas</h4>
        <p className="text-xl font-bold text-gray-900">{formattedTime}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">Horas Complementarias</h4>
        <p className="text-xl font-bold text-gray-900">{formattedDifference}</p>
      </div>
    </div>
  </div>

  {/* Tabla de los días de la semana */}
  <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-t-4 border-blue-500 overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 table-auto">
  <thead className="bg-gray-50">
    <tr>
      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> </th>
      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno de Trabajo</th>
      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
    </tr>
  </thead>
<tbody className="bg-white divide-y divide-gray-200">
  {empleadoData.map((day, index) => {
    const { workShift } = day;

    // 1. indices de bloques
    const blocks = splitIntoBlocksByIndex(workShift);

    // 2. convertir indices → horas
    const minMaxValues = convertBlocksToTimes(blocks);

    console.log(minMaxValues); 
    // Ejemplo: [{min: "09:00", max: "13:00"}, {min: "15:00", max: "18:00"}]

    return (
      <tr key={index}>
        <td className="px-4 py-2">{formatToDate(day)}</td>
        <td className="px-4 py-2">{day.day.charAt(0).toUpperCase() + day.day.slice(1)}</td>
        <td className="px-4 py-2">{getStringBlock(day, minMaxValues)}</td>
        <td className="px-4 py-2">{day.duration.slice(0, 5)}</td>
      </tr>
    );
  })}
</tbody>

</table>
  </div>
</section>
  );
};
