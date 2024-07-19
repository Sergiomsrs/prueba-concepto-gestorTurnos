import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { EmployeePicker } from "../utilComponents/EmployeePicker";
import { findMinMaxOfBlocks, getStringBlock, splitIntoBlocks } from "../utils/blockHours";

export const EmployeeWeek = () => {
  const { data } = useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState("Empleado1");

  // Selección de empleado
  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
  };


  // Obtener array de horas del empleado seleccionado
  const empleadoData = data.map(day => ({
    id: day.id,
    day: day.day,
    horas: day.employees.find(emp => emp.nombre === selectedEmployee)?.horas || []
  }));


  return (
    <section className="p-7">
      <EmployeePicker value={selectedEmployee} onChange={handleEmployeeChange} />

      <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-1 text-sm font-bold text-white ring-1 ring-inset ring-gray-500/10 mb-4">
        {`Semana del ${data[0].id} al ${data[data.length - 1].id}`}
      </span>


      <div className="border rounded-lg shadow-md overflow-x-auto p-4">
        {empleadoData.map((day, index) => {
          const { horas } = day;
          const blocks = splitIntoBlocks(horas);
          const minMaxValues = findMinMaxOfBlocks(blocks);

          return (
            <li key={index} className="flex justify-between gap-x-6">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{getStringBlock(day, minMaxValues)}</p>
                </div>
              </div>
            </li>
          );
        })}
      </div>
    </section>
  );
};
