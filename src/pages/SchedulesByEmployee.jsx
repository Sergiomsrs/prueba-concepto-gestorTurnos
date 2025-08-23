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

  const { auth, logout } = useContext(AuthContext);


  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-11
  });

  const selectedEmployee = employees.find(emp => emp.id === Number(selectedEmployeeId));

  const year = activeTab.year;
  const month = activeTab.month + 1; // 0-11 a 1-12

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDateObj = new Date(year, month, 0);
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(endDateObj.getDate()).padStart(2, "0")}`;

  const { data, employeePto, disponibility } = useSchedules(selectedEmployeeId, startDate, endDate);

  const processedRecords = newProcessTimeStamps(data, selectedEmployeeId);


  return (
    <div className="min-h-screen bg-gray-100 py-8 mt-20 ">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Columna izquierda: EmployeeSelector + NewDatePicker */}
        <div className="md:col-span-2 flex flex-col items-center justify-start">
          <div className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-blue-400 pb-1 text-blue-800">
              Filtros
            </h2>
            {
              (auth.role == "ADMIN" || auth.isAuthenticated == false) &&
            <EmployeeSelector
            employees={employees}
            setEmployees={setEmployees}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            />
          }
            <NewDatePicker activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        {/* Centro: SchedulesList */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-indigo-400 pb-1 text-indigo-800">
              Planificación Mensual
            </h2>
            {data.length <= 0 ? (
              <h1 className="text-red-500">No hay registros</h1>
            ) : (
              <SchedulesList processedRecords={processedRecords} />
            )}
          </div>
        </div>
        {/* Derecha: DispTable */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-emerald-400 pb-1 text-emerald-700">
              Ausencias solicitadas
            </h2>
            {/* Subtítulo y tabla de no disponibilidad */}
            <h3 className="text-base font-semibold text-emerald-700 mb-2">Peticiones de No Disponibilidad</h3>
            <div className="overflow-y-auto max-h-[32vh] mb-4">
              {disponibility.length === 0 ? (
                <p className="text-gray-500">No hay ausencias registradas.</p>
              ) : (
                <DispTable workHours={disponibility} />
              )}
            </div>
            {/* Subtítulo y tabla de vacaciones */}
            <h3 className="text-base font-semibold text-emerald-700 mb-2">Solicitudes de vacaciones</h3>
            <div className="overflow-y-auto max-h-[32vh]">
              {employeePto.length === 0 ? (
                <p className="text-gray-500">No hay vacaciones registradas.</p>
              ) : (
                <PtoTable employeePto={employeePto} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
