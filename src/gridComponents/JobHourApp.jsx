import { useContext, useState, useRef } from "react";
import { HorizontalBar } from "./HorizontalBar ";
import { AppContext } from "../context/AppContext";
import { DistributionBar } from "./DistributionBar";

export const JobHourApp = ({ employees, onHourChange, day, eh, data }) => {
  const { selectedOption } = useContext(AppContext);
  const [startSelection, setStartSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const inputRefsMatrix = useRef([]); // [fila][columna]

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartSelection(null);
  };

  return (
    <>
      <tbody>
        {employees.map((employee, employeeIndex) => {
          // Buscar el turno del día anterior usando el ID del empleado
          const previousShift = eh.find(
            (prevEmployee) => prevEmployee.id === employee.id
          );

          return (
            <tr key={employee.id} onMouseLeave={handleMouseUp}>
              {(selectedOption === "todos" ||
                selectedOption === employee.teamWork) && (
                  <HorizontalBar
                    id={employee.id}
                    data={data}
                    teamWork={employee.teamWork}
                    username={employee.name}
                    lastName={employee.lastName}
                    shiftDurationes={employee.shiftDuration}
                    phours={
                      previousShift ? previousShift.workShift : Array(62).fill("Null")
                    }
                    hours={employee.workShift}
                    startSelection={startSelection}
                    isSelecting={isSelecting}
                    setIsSelecting={setIsSelecting}
                    setStartSelection={setStartSelection}
                    handleMouseUp={handleMouseUp}
                    onHourChange={(hourIndex, value) =>
                      onHourChange(employeeIndex, hourIndex, value)
                    }
                    rowIndex={employeeIndex}
                    inputRefsMatrix={inputRefsMatrix}
                    numRows={employees.length}
                    numCols={employee.workShift.length}
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