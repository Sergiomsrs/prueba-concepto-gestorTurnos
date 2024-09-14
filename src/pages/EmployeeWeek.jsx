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
    workShift: day.employees.find(emp => emp.name === selectedEmployee)?.workShift || []
  }));
  
  console.log(empleadoData);

  return (
    <section className="p-7">
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
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
    </section>
  );
};
