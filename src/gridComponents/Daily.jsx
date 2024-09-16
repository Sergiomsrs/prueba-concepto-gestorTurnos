import { useContext } from "react";

import { calcularshiftDuration, obtenerPreviousDay, generateShiftData, formatDate } from "../utils/function";
import { employess } from "../utils/data";
import { Resumen } from "../gridComponents/Resumen";
import { DatePicker } from "../utilComponents/DatePicker";
import { HeadRow } from "../gridComponents/HeadRow";
import { DayGrid } from "../gridComponents/DayGrid";
import { AppContext } from "../context/AppContext";
import { SectionPicker } from "../utilComponents/SectionPicker";
import { RDias } from "../gridComponents/RDias";
import { JobHourApp } from "./JobHourApp";


export const Daily = () => {

  const { data, setData, date, setDate, setSelectedOption } = useContext(AppContext);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].workShift[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].shiftDuration = calcularshiftDuration(newData[dayIndex].employees[employeeIndex].workShift);
    setData(newData);
  };

  const handlePrint = () => {
/*
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
  
  */
      };

  const handlReset = () => {
    setData(prevData =>
      prevData.map(day => ({
        ...day,
        employees: day.employees.map(employee => ({
          ...employee,
          workShift: Array(62).fill("Null"),
          shiftDuration: '00:00'
        }))
      }))
    );
  };


  return (
    <section className="p-7">
      <DatePicker data={data} date={date} setDate={setDate} setData={setData} setSelectedOption={setSelectedOption} />
      <SectionPicker />
      <div className="border rounded-lg shadow-md overflow-x-auto p-4 ">  {/*incorporar zoom en este div*/}
        {data.map((day, dayIndex) => (dayIndex !== 0 &&
          <div key={day.id}>
            <div className="text-center text-lg font-bold mt-4 mb-4">
              <div className="text-center text-lg font-bold mt-4">
                <div className="inline-block bg-gray-800 text-white text-sm font-semibold px-2 py-1 rounded-full">
                  {formatDate(day)}
                </div>
              </div>
            </div>
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
            <Resumen employess={employess}/>
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