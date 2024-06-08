import { useState } from "react";
import { JobHourApp } from "./JobHourApp";
import { arayToHour } from "./utils/function";
import { days, employees, hours } from "./utils/data";


export const Daily = () => {

 
  
  const generateData = () => {
    return days.map(day => ({
      day,
      employees: employees.map(nombre => ({nombre, horas: Array(56).fill(0), total: '00:00'}))
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

    <body className="p-7</body>">
      <h1 className="mb-4">Semana del {<input type="date" />} al  {<input type="date" />}</h1>


    <div className="border overflow-x-auto">
      {data.map((day, dayIndex) => (
        <table className="table-fixed w-full max-w-full overflow-hidden" key={dayIndex} >
          <thead className="w-auto h-16" >
                <tr>
                  <th className="w-10 p-0 m-0" >{day.day}</th>
                  {
                    hours.map((value, index) => ( <th className="rotate-90 w-2 h-24 "  key={index}> {value} </th> ))
                  }
                  
                  <th className="w-6 p-0 m-0 ">Total</th>
                </tr>
              </thead>
 
          <JobHourApp
            employees={day.employees}
            onHourChange={(employeeIndex, hourIndex, value) => handleHourChange(dayIndex, employeeIndex, hourIndex, value)}
            />
        </table>
      ))}

    </div>
      <div>

      <button onClick={handlePrint}>
        Imprimir
      </button>

        <div>
        <table>
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Total de Horas</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(totalHoursByEmployee).map(([nombre, total]) => (
                    <tr key={nombre}>
                        <td>{nombre}</td>
                        <td>{total}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>


      </div>

   
      </body>
  );
};