import { useContext } from "react";
import { HorizontalBar } from "./HorizontalBar ";
import { AppContext } from "../context/AppContext";
import { DistributionBar } from "./DistributionBar";

export const JobHourApp = ({ employees, onHourChange, day, eh }) => {


  const { selectedOption } = useContext(AppContext);

  return (
    <>
     <tbody>
        {employees.map((employee, employeeIndex) => {
          // Buscar el turno del día anterior usando el ID del empleado
          const previousShift = eh.find(prevEmployee => prevEmployee.id === employee.id);

          return (
            <tr key={employee.id}>
              {(selectedOption === "todos" || selectedOption === employee.teamWork) && (
                <HorizontalBar
                  teamWork={employee.teamWork}
                  username={employee.name}
                  shiftDurationes={employee.shiftDuration}
                  // Si no se encuentra, usar un array de 62 elementos "Null"
                  phours={previousShift ? previousShift.workShift : Array(62).fill("Null")}
                  hours={employee.workShift}
                  onHourChange={(hourIndex, value) =>
                    onHourChange(employeeIndex, hourIndex, value)
                  }
                />
              )}
            </tr>
          );
        })}
        <DistributionBar day={day} />
      </tbody>
    </>
  );
};