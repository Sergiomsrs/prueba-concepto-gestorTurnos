import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const Resumen = ({ employess }) => {

  const {data} = useContext(AppContext);

  const dataWeek = data.slice(1, data.length+1);

  const totalHoursByEmployee = {};

// Iterar sobre los datos
dataWeek.forEach(day => {
    day.employees.forEach(employee => {
        const employeeName = employee.nombre;

        // Verificar si el nombre del empleado ya existe en totalHoursByEmployee
        if (!totalHoursByEmployee[employeeName]) {
            totalHoursByEmployee[employeeName] = 0;
        }

        // Sumar las horas del empleado en este día
        //const totalHoursForDay = employee.horas.reduce((acc, curr) => acc + (curr / 4), 0);
        const totalHoursForDay = employee.horas.filter(item => item !== "Null").length * 0.25;
        totalHoursByEmployee[employeeName] += totalHoursForDay;
    });
});



  return (
    <div className="overflow-x-auto mt-4">
  <table className="table table-hover table-fixed text-center">
 
    <thead>
      <tr>
        <th>Empleado</th>
        <th>Jornada</th>
        <th>Total</th>
        <th>Var</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(totalHoursByEmployee).map(([nombre, total]) => (
        <tr key={nombre}>
          <td >{nombre}</td>
          <td>
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas}
          </td>
          <td>{total}</td>
          <td>
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas - total}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    
  )
}
