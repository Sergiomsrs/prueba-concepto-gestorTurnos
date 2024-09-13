import { useContext } from "react";
import { JobHourApp } from "./JobHourApp";
import { calcularshiftDuration, generateData, generateDatawithDate, obtenerPreviousDay } from "./utils/function";
import { employess } from "./utils/data";
import { Resumen } from "./gridComponents/Resumen";
import { DatePicker } from "./utilComponents/DatePicker";
import { HeadRow } from "./gridComponents/HeadRow";
import { DayGrid } from "./gridComponents/DayGrid";
import { AppContext } from "./context/AppContext";
import { SectionPicker } from "./utilComponents/SectionPicker";
import { RDias } from "./gridComponents/RDias";




export const Daily = () => {


  const { data, setData, date, setDate, setSelectedOption } = useContext(AppContext);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].workShift[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].shiftDuration = calcularshiftDuration(newData[dayIndex].employees[employeeIndex].workShift);
    setData(newData);
  };

  const generateShiftData = (dt) => {
    const shiftData = [];

    dt.slice(1).forEach(day => {
      day.employees.forEach(employee => {
        shiftData.push({
          employeeId: employee.id,
          hours: employee.workShift,
          date: day.id,
          shiftDuration: employee.shiftDuration
        });
      });
    });

    return shiftData;
  };


  const handlePrint = () => {

    const shiftData = generateShiftData(data);


    fetch('http://localhost:8081/api/ws/saveAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shiftData

      ),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));


  };



  const handlReset = () => {

    console.log(data[2].employees[0].workShift.id);

  };






  return (
    <section className="p-7">


      <DatePicker  data={data} date={date} setDate={setDate} setData={setData} setSelectedOption={setSelectedOption} />
      <SectionPicker />



      <div className="border rounded-lg shadow-md overflow-x-auto p-4 ">  {/*incorporar zoom en este div*/}

        {data.map((day, dayIndex) => (dayIndex !== 0 &&
          <div key={day.id}>
            <div className="text-center text-lg font-bold mt-4 "><div className="badge text-white bg-gray-800 w-36">{day.day}</div></div>
            <DayGrid>


              <HeadRow />

              <JobHourApp
                day={day}
                dayIndex={dayIndex}
                eh={obtenerPreviousDay(dayIndex, data).employees}
                employees={day.employees}
                onHourChange={(employeeIndex, hourIndex, value) =>
                  handleHourChange(dayIndex, employeeIndex, hourIndex, value)
                }
              />

            </DayGrid>
          </div>
        ))}


        <div className="w-full flex  flex-row">

          <div className="flex-1">
            <Resumen employess={employess} />
          </div>
          <div className="flex-1">
            <RDias />
          </div>
        </div>

        <div className="flex gap-4">


          <button onClick={handlePrint} type="button" className="bg-emerald-700 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded min-w-32">Guardar</button>


          <button onClick={handlReset} type="button" className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded min-w-32">Reset</button>

        </div>

      </div>



    </section>

  );
};