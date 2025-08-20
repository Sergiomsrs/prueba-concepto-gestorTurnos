import { useEffect, useState } from "react";
import { searchActiveEmployees } from "../services/employees";
import { EmployeeSelector } from "../utilComponents/EmployeeSelector";
import { NewDatePicker } from "../utilComponents/NewDatePicker";
import { fetchAbsences } from "../utils/timeManager";
import { DispTable } from "../formComponents/utils/DispTable";
import { activeEmployeesMock, dispMockData } from "../utils/apiMock";
import { useSchedules } from "../Hooks/useSchedules";
import { processTimeStamps } from "../timeTrack/utilities/timeManagement";
import { SchedulesList } from "../utilComponents/SchedulesList";

export const SchedulesByEmployee = () => {
  const [employees, setEmployees] = useState(activeEmployeesMock);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [workHours, setWorkHours] = useState(dispMockData);

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

  const { data, loading, error } = useSchedules(selectedEmployeeId, startDate, endDate);

  const processedRecords = processTimeStamps(data, selectedEmployeeId);

  useEffect(() => {
    if (!selectedEmployeeId) return;
    fetchAbsences(selectedEmployeeId)
      .then(result => {
        if (result.status !== 200) {
          setWorkHours(dispMockData);
        } else {
          setWorkHours(result.data);
        }
      })
      .catch(error => {
        setWorkHours(dispMockData);
        console.error(error);
      });
  }, [selectedEmployeeId]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Columna izquierda: EmployeeSelector + NewDatePicker */}
        <div className="md:col-span-2 flex flex-col items-center justify-start">
          <div className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-blue-400 pb-1 text-blue-800">
              Selector
            </h2>
            <EmployeeSelector
              employees={employees}
              setEmployees={setEmployees}
              selectedEmployeeId={selectedEmployeeId}
              setSelectedEmployeeId={setSelectedEmployeeId}
            />
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
        <div className="md:col-span-4 flex flex-col">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 h-full">
            <h2 className="text-lg font-bold mb-4 border-b-4 border-emerald-400 pb-1 text-emerald-700">
              Ausencias solicitadas
            </h2>
            <div className="overflow-y-auto max-h-[70vh]">
              {workHours.length > 0 ? (
                <DispTable workHours={workHours} />
              ) : (
                <p className="text-gray-500">No hay ausencias registradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
