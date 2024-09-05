import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const Resumen = ({ employess }) => {

  const {data} = useContext(AppContext);

  const dataWeek = data.slice(1, data.length+1);

  const totalHoursByEmployee = {};

// Iterar sobre los datos
dataWeek.forEach(day => {
    day.employees.forEach(employee => {
        const employeeName = employee.name;

        // Verificar si el name del empleado ya existe en totalHoursByEmployee
        if (!totalHoursByEmployee[employeeName]) {
            totalHoursByEmployee[employeeName] = 0;
        }

        // Sumar las workShift del empleado en este día
        //const totalHoursForDay = employee.workShift.reduce((acc, curr) => acc + (curr / 4), 0);
        const totalHoursForDay = employee.workShift.filter(item => item !== "Null").length * 0.25;
        totalHoursByEmployee[employeeName] += totalHoursForDay;
    });
});



  return (
    <div className="overflow-x-auto mt-4">
  <table className="table table-hover table-fixed text-center">
 
    <thead>
      <tr>
        <th>Empleado</th>
        <th>wwh</th>
        <th>Total</th>
        <th>Var</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(totalHoursByEmployee).map(([name, total]) => (
        <tr key={name}>
          <td >{name}</td>
          <td>
            {employess.find((emp) => emp.name === name)?.wwh[0].workShift}
          </td>
          <td>{total}</td>
          <td>
            {employess.find((emp) => emp.name === name)?.wwh[0].workShift - total}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    
  )
}
