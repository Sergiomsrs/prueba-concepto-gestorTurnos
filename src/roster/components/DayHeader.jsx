import { memo } from 'react';

export const DayHeader = memo(({ day }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
                {formatDate(day.id)}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
                {day.day}
            </p>
        </div>
    );
});

DayHeader.displayName = 'DayHeader';