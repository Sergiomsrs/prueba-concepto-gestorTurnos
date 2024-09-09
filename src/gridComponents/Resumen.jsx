import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";


export const Resumen = () => {
  const { data } = useContext(AppContext);
  const [totalHoursByEmployee, setTotalHoursByEmployee] = useState({});

  useEffect(() => {
    const dataWeek = data.slice(1, data.length + 1);
    const totalHours = {};

    dataWeek.forEach(day => {
      day.employees.forEach(employee => {
        const employeeName = employee.name;

        if (!totalHours[employeeName]) {
          totalHours[employeeName] = 0;
        }

        const totalHoursForDay = employee.workShift.filter(item => item !== "Null").length * 0.25;
        totalHours[employeeName] += totalHoursForDay;
      });
    });

    setTotalHoursByEmployee(totalHours);
  }, [data]);

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
              <td>{name}</td>
              <td>{data[0]?.employees.find((emp) => emp.name === name)?.wwh}</td>
              <td>{total}</td>
              <td>{data[0]?.employees.find((emp) => emp.name === name)?.wwh - total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};