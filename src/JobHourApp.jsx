
import { useContext } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { AppContext } from "./context/AppContext";
import { DistributionBar } from "./gridComponents/DistributionBar";



export const JobHourApp = ({ employees, onHourChange, day }) => {
  
  const {selectedOption } = useContext(AppContext);


  

  // Filtrar empleados por la sección seleccionada
  const filteredEmployees = employees.filter(employee => employee.seccion === selectedOption);

  return (
    <>
      <tbody>
      {employees.map((employee, employeeIndex) => (
        <tr key={employee.nombre}>
          {(selectedOption === "todos" || selectedOption === employee.seccion) && (
            <HorizontalBar
              seccion={employee.seccion}
              day={day}
              username={employee.nombre}
              totales= {employee.total}
              hours={employee.horas}
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