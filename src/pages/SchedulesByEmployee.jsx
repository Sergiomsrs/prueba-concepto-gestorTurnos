import { useContext, useState } from "react";
import { EmployeeSelector } from "../utilComponents/EmployeeSelector";
import { NewDatePicker } from "../utilComponents/NewDatePicker";
import { DispTable } from "../formComponents/utils/DispTable";
import { activeEmployeesMock, dispMockData } from "../utils/apiMock";
import { useSchedules } from "../Hooks/useSchedules";
import { newProcessTimeStamps } from "../timeTrack/utilities/timeManagement";
import { SchedulesList } from "../utilComponents/SchedulesList";
import { PtoTable } from "../formComponents/utils/PtoTable";
import { AuthContext } from "../timeTrack/context/AuthContext";

export const SchedulesByEmployee = () => {
  const [employees, setEmployees] = useState(activeEmployeesMock);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);

  const { auth } = useContext(AuthContext);


  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-11
  });

  const year = activeTab.year;
  const month = activeTab.month + 1; // 0-11 a 1-12

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDateObj = new Date(year, month, 0);
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(endDateObj.getDate()).padStart(2, "0")}`;

  const { data, employeePto, disponibility } = useSchedules(selectedEmployeeId, startDate, endDate);

  const processedRecords = newProcessTimeStamps(data, selectedEmployeeId);


  return (
    <div className="min-h-screen bg-gray-100 mt-6 flex justify-center">
      {/* Cambiamos a flex-col en móvil y flex-row en desktop para controlar mejor el flujo */}
      <div className="flex flex-col md:flex-row gap-4 w-full sm:w-3/4">

        {/* --- COLUMNA IZQUIERDA (Filtros y Ausencias) --- */}
        {/* En móvil, usamos 'contents' para que los hijos sigan participando en el orden del padre */}
        <div className="flex flex-col gap-4 md:w-1/3 contents md:flex">

          {/* 1. FILTROS: Siempre arriba (Order 1) */}
          <div className="order-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-blue-400 pb-1 text-blue-800">
              Filtros
            </h2>
            {(auth.role === "ADMIN" || auth.isAuthenticated === false) && (
              <EmployeeSelector
                employees={employees}
                setEmployees={setEmployees}
                selectedEmployeeId={selectedEmployeeId}
                setSelectedEmployeeId={setSelectedEmployeeId}
                activeTab={activeTab}
              />
            )}
            <NewDatePicker activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* 3. AUSENCIAS: Abajo en móvil (Order 3), justo bajo filtros en PC */}
          <div className="order-3 w-full bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-emerald-400 pb-1 text-emerald-700">
              Ausencias solicitadas
            </h2>
            <h3 className="text-base font-semibold text-emerald-700 mb-2 font-mono">Peticiones de No Disponibilidad</h3>
            <div className="overflow-y-auto max-h-[32vh] mb-4">
              {disponibility.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No hay ausencias registradas.</p>
              ) : (
                <DispTable workHours={disponibility} />
              )}
            </div>
            <h3 className="text-base font-semibold text-emerald-700 mb-2 font-mono">Solicitudes de vacaciones</h3>
            <div className="overflow-y-auto max-h-[32vh]">
              {employeePto.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No hay vacaciones registradas.</p>
              ) : (
                <PtoTable employeePto={employeePto} />
              )}
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA (Planificación Mensual) --- */}
        {/* 2. PLANIFICACIÓN: En medio en móvil (Order 2), a la derecha en PC */}
        <div className="order-2 md:flex-1 flex flex-col items-center">
          <div className="w-full bg-gray-100  p-0 md:p-6 overflow-hidden">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-indigo-400 pb-1 text-indigo-800 mt-4 mx-4 md:mx-0">
              Planificación Mensual
            </h2>
            {data.length <= 0 ? (
              <h1 className="text-red-500 font-medium text-center py-4">No hay registros</h1>
            ) : (
              <SchedulesList processedRecords={processedRecords} />
            )}
          </div>
        </div>

      </div>
    </div>
  );

}