import { memo } from 'react';
import { EmployeeRow } from './EmployeeRow';

export const EmployeeList = memo(({ employees, onShiftChange }) => {
    if (!employees?.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No hay empleados asignados para este día
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {employees.map((employee, employeeIndex) => (
                <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    employeeIndex={employeeIndex}
                    onShiftChange={onShiftChange}
                />
            ))}
        </div>
    );
});

EmployeeList.displayName = 'EmployeeList';