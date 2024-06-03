import { useState } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { arayToHour } from "./utils/function";


const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];

export const JobHourApp = () => {
  const [employeeData, setEmployeeData] = useState(employees.map(username => ({ username, hours: Array(56).fill(0), totalHours: 0 })));

  // Manejar el cambio en las horas de un empleado
  const handleHourChange = (index, employeeIndex, value) => {
    const newEmployeeData = [...employeeData];
    newEmployeeData[employeeIndex].hours[index] = value;

    // Calcular el total de horas del empleado
    const totalHours = arayToHour(newEmployeeData[employeeIndex].hours); 
    newEmployeeData[employeeIndex].totalHours = totalHours;

    setEmployeeData(newEmployeeData);
  };

  return (
    <fieldset>
      <legend>Lunes</legend>
      {employeeData.map((employee, employeeIndex) => (
        <div key={employeeIndex}>
          <HorizontalBar
            username={employee.username}
            hours={employee.hours}
            totalHours={employee.totalHours}
            onHourChange={(index, value) => handleHourChange(index, employeeIndex, value)}
          />
        </div>
      ))}
      <button onClick={() => console.log(employeeData)}>
        Imprimir
      </button>
    </fieldset>
  );
};