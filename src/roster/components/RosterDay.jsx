import { HeadRow } from "./HeadRow";
import { EmployeeRow } from "./EmployeeRow";
import { DistributionRow } from "./DistributionRow";


export const RosterDay = ({ day, dayIndex, dispatch }) => (
    <div className="space-y-2">
        <h1 className="text-lg font-bold">
            {day.id} <span className="text-gray-500">{day.day?.toUpperCase()}</span>
        </h1>

        <div className="grid grid-cols-[auto_auto_repeat(60,_1fr)_auto] gap-1 items-center overflow-x-auto">
            <HeadRow />
            {day.employees?.map((employee, employeeIndex) => (
                <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    dayIndex={dayIndex}
                    employeeIndex={employeeIndex}
                    dispatch={dispatch}
                />
            ))}
            <DistributionRow day={day} />
        </div>
    </div>
);
