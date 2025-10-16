import { memo, useCallback } from 'react';
import { DayHeader } from './DayHeader';
import { EmployeeList } from './EmployeeList';
import { DistributionBar } from '../../gridComponents/DistributionBar';

export const DayCard = memo(({ day, dayIndex, onShiftUpdate }) => {
    const handleShiftChange = useCallback((employeeIndex, hourIndex) => {
        onShiftUpdate({
            type: "UPDATE_SHIFT",
            payload: { dayIndex, employeeIndex, hourIndex }
        });
    }, [dayIndex, onShiftUpdate]);

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <DayHeader day={day} />

            <div className="p-4">
                <EmployeeList
                    employees={day.employees}
                    onShiftChange={handleShiftChange}
                />

                {/* Distribution Bar al final */}
                <div className="mt-4 pt-4 border-t">
                    <DistributionBar day={day} />
                </div>
            </div>
        </div>
    );
});

DayCard.displayName = 'DayCard';