import { useContext } from "react";
import { JobHourApp } from "./JobHourApp";
import { arayToHour, calcularTotal } from "./utils/function";
import { employess } from "./utils/data";
import { Resumen } from "./gridComponents/Resumen";
import { DatePicker } from "./utilComponents/DatePicker";
import { HeadRow } from "./gridComponents/HeadRow";
import { DayGrid } from "./gridComponents/DayGrid";
import { AppContext } from "./context/AppContext";
import { SectionPicker } from "./utilComponents/SectionPicker";




export const Daily = () => {


  const { data, setData, date } = useContext(AppContext);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].horas[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].total = calcularTotal( newData[dayIndex].employees[employeeIndex].horas);
    setData(newData);
  };

  const handlePrint = () => {
    console.log(JSON.stringify(data)); // Imprimir el objeto completo con la información actualizada
    console.log(date)
  };


  return (
    <section className="p-7">

      <DatePicker />
      <SectionPicker />



      <div className="border rounded-lg shadow-md overflow-x-auto p-4">

        {data.map((day, id, dayIndex) => (
          <div key={id}>
            <div className="text-center text-lg font-bold mt-4 "><div className="badge text-white bg-gray-800 w-36">{day.day}</div></div>
            <DayGrid dayIndex={id}>


              <HeadRow />

              <JobHourApp
               dayIndex={dayIndex}
                day={day}
                employees={day.employees}
                onHourChange={(employeeIndex, hourIndex, value) =>
                  handleHourChange(id, employeeIndex, hourIndex, value)
                }
              />
              
            </DayGrid>
          </div>
        ))}



        <Resumen employess={employess} />



        <div className="mt-4 mb-4">
          <button onClick={handlePrint} type="button" className="btn btn-success">Guardar</button>
        </div>
      </div>



    </section>

  );
};