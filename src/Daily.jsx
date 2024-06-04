import { useState } from "react";
import { JobHourApp } from "./JobHourApp";
import { arayToHour } from "./utils/function";

export const Daily = () => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];
  
  const generateData = () => {
    return days.map(day => ({
      day,
      employees: employees.map(nombre => ({nombre, horas: Array(56).fill(0), total: '00:00'}))
    }));
  };
  
  const [data, setData] = useState(generateData());
  
  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].horas[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].total = arayToHour(newData[dayIndex].employees[employeeIndex].horas);
    setData(newData);
  };

  const handlePrint = () => {
    console.log(JSON.stringify(data)); // Imprimir el objeto completo con la información actualizada
  };
  
  return (
    <div className="border">
      {data.map((day, dayIndex) => (
        <div key={dayIndex} className="border m-5 p-2" >
          <h2>{day.day}</h2>
          <JobHourApp
            employees={day.employees}
            onHourChange={(employeeIndex, hourIndex, value) => handleHourChange(dayIndex, employeeIndex, hourIndex, value)}
          />
        </div>
      ))}
      <button onClick={handlePrint}>
        Imprimir
      </button>
    </div>
  );
};