import { useState } from "react";
import { JobHourApp } from "./JobHourApp";
import { arayToHour } from "./utils/function";
import { days, employess, hours } from "./utils/data";
import { Resumen } from "./gridComponents/Resumen";


export const Daily = () => {

 
  
  const generateData = () => {
    return days.map(day => ({
      day,
      employees: employess.map(emp => ({nombre: emp.nombre, seccion:emp.seccion, horas: Array(78).fill(0), total: '00:00'}))
    }));
  };
  
  const [data, setData] = useState(generateData());
  
  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].horas[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].total = arayToHour(newData[dayIndex].employees[employeeIndex].horas);
    setData(newData);
  };

  const handlePrint = () => {
    console.log(JSON.stringify(data)); // Imprimir el objeto completo con la información actualizada
    console.log(JSON.stringify(totalHoursByEmployee)); // Imprimir el objeto completo con la información actualizada
  };

  const totalHoursByEmployee = {};

// Iterar sobre los datos
data.forEach(day => {
    day.employees.forEach(employee => {
        const employeeName = employee.nombre;

        // Verificar si el nombre del empleado ya existe en totalHoursByEmployee
        if (!totalHoursByEmployee[employeeName]) {
            totalHoursByEmployee[employeeName] = 0;
        }

        // Sumar las horas del empleado en este día
        const totalHoursForDay = employee.horas.reduce((acc, curr) => acc + (curr / 4), 0);
        totalHoursByEmployee[employeeName] += totalHoursForDay;
    });
});



  
  return (
    <section className="p-7">
      <h1 className="mb-4">
      Semana del {<input type="date" />} al {<input type="date" />}
      </h1>

      <div className="border overflow-x-auto">
      {data.map((day, dayIndex) => (
        <>
        <h3 className="m-0 p-0">{day.day}</h3>
        <table className="table-fixed w-full max-w-full overflow-hidden mt-0 pt-0" key={dayIndex}>
        
        <thead className="w-auto h-40 mb-3">
          <tr>
          <th className="w-12 p-0 align-bottom">Seccion</th>
          <th className="w-12 p-0 align-bottom">Nombre</th>
          {hours.entrada.map((entrada, index) => (
            <th className="rotate-90 w-2 h-36" key={index}>
            <div className="flex justify-center"> {/* Add justify-center class */}
              <div>{entrada}</div>
              <div>-</div>
              <div>{hours.salida[index]}</div>
            </div>
            </th>
          ))}
          <th className="w-8 p-0 m-0 align-bottom">Total</th>
          </tr>
        </thead>

        <JobHourApp
          employees={day.employees}
          onHourChange={(employeeIndex, hourIndex, value) =>
            handleHourChange(dayIndex, employeeIndex, hourIndex, value)
            }
            />
        </table>
      </>
      ))}
      </div>

      <div>
      <button onClick={handlePrint}>Imprimir</button>

      </div>
      <Resumen totalHoursByEmployee={totalHoursByEmployee} employess={employess}/>
    </section>

  );
};