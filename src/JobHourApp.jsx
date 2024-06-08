
import { HorizontalBar } from "./gridComponents/HorizontalBar ";



export const JobHourApp = ({ employees, onHourChange }) => {

  
  return (
    <>
          <tbody>
      {employees.map((employee, employeeIndex) => (
        <tr key={employeeIndex}>
                  
                    
          <HorizontalBar
            username={employee.nombre}
            hours={employee.horas}
            onHourChange={(hourIndex, value) => onHourChange(employeeIndex, hourIndex, value)}
          />
          
                  
        </tr>
      ))}
      </tbody>
    </>
  );
};