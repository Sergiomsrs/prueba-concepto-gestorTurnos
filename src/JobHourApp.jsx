
import { useContext } from "react";
import { HorizontalBar } from "./gridComponents/HorizontalBar ";
import { AppContext } from "./context/AppContext";



export const JobHourApp = ({ employees, onHourChange }) => {

  const {data, selectedOption } = useContext(AppContext);

  // Filtrar empleados por la sección seleccionada
  const filteredEmployees = employees.filter(employee => employee.seccion === selectedOption);

  return (
    <>
      <tbody>
        {employees.map((employee, employeeIndex) => (
          <tr key={employee.nombre}>
            <HorizontalBar
              seccion={employee.seccion}
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