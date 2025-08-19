import { useEffect, useState } from "react"
import { searchActiveEmployees } from "../services/employees";
import { EmployeeSelector } from "../utilComponents/EmployeeSelector";
import { fetchAbsences } from "../utils/timeManager";
import { DispTable } from "../formComponents/utils/DispTable";
import { activeEmployeesMock, dispMockData } from "../utils/apiMock";
import { useSchedules } from "../Hooks/useSchedules";
//http://localhost:8081/api/schedule/employee/1/schedules?startDate=2025-08-01&endDate=2025-08-31
export const SchedulesByEmployee = () => {
    const [employees, setEmployees] = useState(activeEmployeesMock);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
    const [workHours, setWorkHours] = useState(dispMockData)

    const selectedEmployee = employees.find(emp => emp.id === Number(selectedEmployeeId));
    
    
    const { data, loading, error } = useSchedules(selectedEmployeeId, '2025-08-01', '2025-08-31');

    console.log(data)

    useEffect(() => {
        if (!selectedEmployeeId) return;
        fetchAbsences(selectedEmployeeId)
            .then(result => {
                // Si tu función devuelve { status, data }
                if (result.status !== 200) {
                    setWorkHours(dispMockData);
                } else {
                    setWorkHours(result.data);
                }
            })
            .catch(error => {
                setWorkHours(dispMockData); // <-- aquí pones los valores por defecto si hay error de conexión
                console.error(error);
            });
    }, [selectedEmployeeId]);


    return (
        <div className="mt-8">
            <EmployeeSelector
            employees={employees}
            setEmployees={setEmployees}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            
            />
            
            
{/*             {selectedEmployee && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                    <div><strong>ID:</strong> {selectedEmployee.id}</div>
                    <div><strong>Nombre:</strong> {selectedEmployee.name} {selectedEmployee.lastName}</div>
                    <div><strong>Email:</strong> {selectedEmployee.email}</div>
                </div>
            )} */}

            {/* Tabla de jornadas */}
            <h2 className="font-bold text-xl mb-8">Listado de ausencias solicitadas</h2>
            <hr />
                        {workHours.length > 0 && (
                           <DispTable workHours={workHours} />
                        )}
        </div>
    )
}
