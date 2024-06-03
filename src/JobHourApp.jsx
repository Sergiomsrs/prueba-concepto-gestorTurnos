import { useState } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { arayToHour } from "./utils/function";


//const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];

export const JobHourApp = ({ employees, onHourChange }) => {
  return (
    <>
      {employees.map((employee, employeeIndex) => (
        <div key={employeeIndex}>
          <HorizontalBar
            username={employee.nombre}
            hours={employee.horas}
            totalHours={employee.total}
            onHourChange={(hourIndex, value) => onHourChange(employeeIndex, hourIndex, value)}
          />
        </div>
      ))}
    </>
  );
};