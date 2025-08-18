import { useContext, useState } from "react";
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
import { MenuIcon } from "../icon/MenuIcon";
import { SideBar } from "./SideBar";
import { AlertMessage } from "../timeTrack/components/AlertMessage";

export const Daily = () => {
  const { data, setData, date, setDate, setSelectedOption, holidayDates } = useContext(AppContext);
  const [isModalOpen, setModalOpen] = useState(false);

  // Estado para la alerta
  const [alert, setAlert] = useState({ isOpen: false, message: null });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleHourChange = (dayIndex, employeeIndex, hourIndex, value) => {
    const newData = [...data];
    newData[dayIndex].employees[employeeIndex].workShift[hourIndex] = value;
    newData[dayIndex].employees[employeeIndex].shiftDuration = calcularshiftDuration(newData[dayIndex].employees[employeeIndex].workShift);
    setData(newData);
  };

  const handlePrint = () => {
    const shiftData = generateShiftData(data);

    fetch('http://localhost:8081/api/ws/saveAll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiftData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          setAlert({
            isOpen: true,
            message: { type: "success", text: data.message }
          });
        } else {
          setAlert({
            isOpen: true,
            message: { type: "error", text: "⚠️ " + data.message + "\nDetalles: " + (data.data || "") }
          });
        }
        setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
      })
      .catch(error => {
        setAlert({
          isOpen: true,
          message: { type: "error", text: "Error de red al conectar con el servidor" }
        });
        setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
      });
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
    <section className="flex flex-col mx-2 sm:mx-0 ">
      <DatePicker data={data} date={date} setDate={setDate} setData={setData} setSelectedOption={setSelectedOption} />
      <SectionPicker />
      <div className="border rounded-lg shadow-md overflow-x-auto p-4 relative">
        <MenuIcon sideBarClick={handleOpenModal}/>
        {isModalOpen && <SideBar sideBarClick={handleCloseModal} isOpen={isModalOpen}/>}
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
          <Resumen className="flex-none w-max" employess={employess} />
          <RDias className="flex-none w-max" />
        </div>

        <div className="flex gap-4 over">
          <button onClick={handlePrint} type="button" className="bg-emerald-700 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded min-w-32">Guardar</button>
          <button onClick={handlReset} type="button" className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded min-w-32">Reset</button>
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