import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { DatePicker } from "../../utilComponents/DatePicker";
import { SectionPicker } from "../../utilComponents/SectionPicker";
import { MenuIcon } from "../../icon/MenuIcon";
import { SideBar } from "../../gridComponents/SideBar";
import { calcularshiftDuration, formatDate, obtenerPreviousDay } from "../../utils/function";
import { DayGrid } from "../../gridComponents/DayGrid";
import { HeadRow } from "../../gridComponents/HeadRow";
import { JobHourApp } from "../../gridComponents/JobHourApp";
import { Resumen } from "../../gridComponents/Resumen";
import { RDias } from "../../gridComponents/RDias";
import { AlertMessage } from "../../timeTrack/components/AlertMessage";
import { useCyclesGenerator } from "../../Hooks/useCyclesGenerator";


export const CyclesGenerator = () => {

  const { holidayDates, fetchShiftWeek, alert, saveData, resetData } = useContext(AppContext);

  const { data, setData, handleSaveCycle } = useCyclesGenerator();

  console.log("Data desde cicles", data)

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
    <section className="flex flex-col mx-2 sm:mx-0 mt-6 ">

      <SectionPicker data={data} />
      <div className="border rounded-lg shadow-md overflow-x-auto p-4 relative">
        <MenuIcon sideBarClick={handleOpenModal} />
        {isModalOpen && <SideBar sideBarClick={handleCloseModal} isOpen={isModalOpen} />}
        {data.map((day, dayIndex) => (dayIndex !== 0 &&
          <div key={day.id}>
            <div className="text-center text-lg font-bold mt-4 mb-4">
              <div className="text-center text-lg font-bold mt-4">
                <div className="inline-block bg-gray-800 text-white text-sm font-semibold px-2 py-1 rounded-full min-w-32">
                  {day.day}
                </div>
              </div>
            </div>
            <DayGrid>
              <HeadRow />
              <JobHourApp
                day={day}
                data={data}
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
          <button onClick={handleSaveCycle} type="button" className="bg-emerald-700 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded min-w-32">Guardar</button>
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