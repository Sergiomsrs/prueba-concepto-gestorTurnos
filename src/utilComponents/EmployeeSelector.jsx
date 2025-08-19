import { useEffect } from 'react'
import { searchActiveEmployees } from '../services/employees';

export const EmployeeSelector = ({employees, setEmployees, selectedEmployeeId, setSelectedEmployeeId}) => {

        useEffect(() => {
            searchActiveEmployees()
                .then(data => setEmployees(data))
                .catch(error => console.error(error));
        }, []);
    

  return (
    <>
    <label className="block text-base font-medium leading-6 text-gray-900">Selecciona el empleado</label>
            <div className="relative mt-2 mb-4 rounded-md shadow-sm">
                <select
                    id="employee"
                    name="employee"
                    value={selectedEmployeeId}
                    onChange={e => setSelectedEmployeeId(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                >
                    <option value="">-- Selecciona --</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.name} {emp.lastName}
                        </option>
                    ))}
                </select>
            </div>
    </>
  )
}
