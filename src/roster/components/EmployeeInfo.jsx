import { memo } from 'react';

export const EmployeeInfo = memo(({ name, teamWork }) => (
    <div className="flex gap-3 min-w-[200px]">
        <p className="font-medium">{name}</p>
        <p className="text-gray-600">{teamWork}</p>
    </div>
));