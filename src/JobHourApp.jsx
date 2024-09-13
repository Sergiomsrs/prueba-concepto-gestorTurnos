
import { useContext } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { AppContext } from "./context/AppContext";
import { DistributionBar } from "./gridComponents/DistributionBar";



export const JobHourApp = ({ employees, onHourChange, day, dayIndex, eh }) => {
  
  const {selectedOption } = useContext(AppContext);
  


  // Filtrar empleados por la sección seleccionada
  const filteredEmployees = employees.filter(employee => employee.teamWork === selectedOption);

  return (
    <>
      <tbody>
      {employees.map((employee, employeeIndex) => (
        <tr key={employee.name}>
          {(selectedOption === "todos" || selectedOption === employee.teamWork) && (
            <HorizontalBar
              teamWork={employee.teamWork}
              day={day}
              dayIndex={dayIndex}
              username={employee.name}
              shiftDurationes= {employee.shiftDuration}
              phours= {eh[employeeIndex].workShift}
              hours={employee.workShift}
              onHourChange={(hourIndex, value) =>
                onHourChange(employeeIndex, hourIndex, value)
              }
            />
          )}
        </tr>
      ))}
      <DistributionBar day = {day}/>
    </tbody>
    </>
  );
};