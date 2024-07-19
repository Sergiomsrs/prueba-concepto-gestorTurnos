import { useContext } from "react";
import { JobHourApp } from "./JobHourApp";
import { calcularTotal, generateData } from "./utils/function";
import { employess } from "./utils/data";
import { Resumen } from "./gridComponents/Resumen";
import { DatePicker } from "./utilComponents/DatePicker";
import { HeadRow } from "./gridComponents/HeadRow";
import { DayGrid } from "./gridComponents/DayGrid";
import { AppContext } from "./context/AppContext";
import { SectionPicker } from "./utilComponents/SectionPicker";




export const Daily = () => {


  const { data, setData, date, setDate } = useContext(AppContext);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].horas[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].total = calcularTotal(newData[dayIndex].employees[employeeIndex].horas);
    setData(newData);
  };

  const handlePrint = () => {
    console.log(
      JSON.stringify(data[6])
    );
    console.log(date.start)

  };
  const handlReset = () => {
    setData(generateData());
  };


  return (
    <section className="p-7">

      <DatePicker date={date} setDate={setDate} />
      <SectionPicker />



      <div className="border rounded-lg shadow-md overflow-x-auto p-4">

        {data.map((day, index) => (
          console.log(index),
          <div key={day.id}>
            <div className="text-center text-lg font-bold mt-4 "><div className="badge text-white bg-gray-800 w-36">{day.day}</div></div>
            <DayGrid dayIndex={index}>


              <HeadRow />

              <JobHourApp
                day={day}
                employees={day.employees}
                onHourChange={(employeeIndex, hourIndex, value) =>
                  handleHourChange(index, employeeIndex, hourIndex, value)
                }
              />

            </DayGrid>
          </div>
        ))}



        <Resumen employess={employess} />

        <div className="flex gap-4">


          <button onClick={handlePrint} type="button" className="bg-emerald-700 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded min-w-32">Guardar</button>


          <button onClick={handlReset} type="button" className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded min-w-32">Reset</button>

        </div>

      </div>



    </section>

  );
};