import { AlertMessage } from "../timeTrack/components/AlertMessage";
import { AppContext } from "../context/AppContext";
import { calcularshiftDuration, obtenerPreviousDay, generateShiftData, formatDate } from "../utils/function";
import { DatePicker } from "../utilComponents/DatePicker";
import { DayGrid } from "../gridComponents/DayGrid";
import { employess } from "../utils/data";
import { HeadRow } from "../gridComponents/HeadRow";
import { JobHourApp } from "./JobHourApp";
import { MenuIcon } from "../icon/MenuIcon";
import { RDias } from "../gridComponents/RDias";
import { Resumen } from "../gridComponents/Resumen";
import { SectionPicker } from "../utilComponents/SectionPicker";
import { SideBar } from "./SideBar";
import { useContext, useState } from "react";

export const Daily = () => {

  const { holidayDates, data, setData, fetchShiftWeek, alert, saveData, resetData } = useContext(AppContext);

  console.log(data)

  const [date, setDate] = useState({ start: "", end: "" });
  const [selectedOption, setSelectedOption] = useState("todos");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearch = () => {
    if (date.start && date.end) fetchShiftWeek(date.start, date.end);
    setSelectedOption("todos");
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].workShift[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].shiftDuration = calcularshiftDuration(newData[dayIndex].employees[employeeIndex].workShift);
    setData(newData);
  };


  return (
    <section className="flex flex-col mx-2 sm:mx-0 sm:px-16 ">
      <div className="mb-4">

        <DatePicker date={date} setDate={setDate} onSearch={handleSearch} />
        <SectionPicker data={data} />
      </div>
      <div className="border rounded-lg shadow-md overflow-x-auto p-4 relative">
        <MenuIcon sideBarClick={handleOpenModal} />
        {isModalOpen && <SideBar sideBarClick={handleCloseModal} isOpen={isModalOpen} />}
        {data.map((day, dayIndex) => (dayIndex !== 0 &&
          <div key={day.id}>
            <div className="text-center text-lg font-bold mt-4 mb-4">
              <div className="text-center text-lg font-bold mt-4">
                <div className="inline-block bg-gray-800 text-white text-sm font-semibold px-2 py-1 rounded-full">
                  {formatDate(day, holidayDates)}
                </div>
              </div>
            </div>
            <DayGrid>
              <HeadRow />
              <JobHourApp
                data={data}
                day={day}
                eh={obtenerPreviousDay(dayIndex, data).employees}
                employees={day.employees}
                onHourChange={(employeeIndex, hourIndex, value) =>
                  handleHourChange(dayIndex, employeeIndex, hourIndex, value)
                }
              />
            </DayGrid>
          </div>
        ))}

        <div className="flex overflow-x-auto py-8 my-8 bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 w-[1030px] sm:w-full">
          <Resumen data={data} className="flex-none w-max" />
          <RDias data={data} className="flex-none w-max" />
        </div>

        <div className="flex gap-4 over">
          <button onClick={saveData} type="button" className="bg-emerald-700 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded min-w-32">Guardar</button>
          <button onClick={resetData} type="button" className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded min-w-32">Reset</button>
        </div>
      </div>

      {/* Alerta centrada */}
      {alert.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
          <AlertMessage isOpen={alert.isOpen} message={alert.message} />
        </div>
      )}
    </section>
  );
};