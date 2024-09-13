import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";


export const Resumen = () => {
  const { data } = useContext(AppContext);
  const [shiftDurationHoursByEmployee, setshiftDurationHoursByEmployee] = useState({});

  useEffect(() => {
    const dataWeek = data.slice(1, data.length + 1);
    const shiftDurationHours = {};

    dataWeek.forEach(day => {
      day.employees.forEach(employee => {
        const employeeName = employee.name;

        if (!shiftDurationHours[employeeName]) {
          shiftDurationHours[employeeName] = 0;
        }

        const shiftDurationHoursForDay = employee.workShift.filter(item => item !== "Null").length * 0.25;
        shiftDurationHours[employeeName] += shiftDurationHoursForDay;
      });
    });

    setshiftDurationHoursByEmployee(shiftDurationHours);
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
          {Object.entries(shiftDurationHoursByEmployee).map(([name, shiftDuration]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{data[0]?.employees.find((emp) => emp.name === name)?.wwh}</td>
              <td>{shiftDuration}</td>
              <td>{(data[0]?.employees.find((emp) => emp.name === name)?.wwh ?? 0) - shiftDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};