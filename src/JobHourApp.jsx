
import { useContext } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { AppContext } from "./context/AppContext";
import { arayToHour } from "./utils/function";
import { DistributionBar } from "./gridComponents/DistributionBar";



export const JobHourApp = ({ employees, onHourChange, day, dayIndex }) => {
  
  const {data, selectedOption } = useContext(AppContext);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].horas[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].total = arayToHour(newData[dayIndex].employees[employeeIndex].horas);
    setData(newData);
  };
  

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