import { memo, useCallback } from 'react';

export const ShiftCheckbox = memo(({ hourIndex, isChecked, onToggle }) => {
    const handleChange = useCallback(() => {
        onToggle(hourIndex);
    }, [hourIndex, onToggle]);

    return (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className="w-4 h-4 cursor-pointer"
        />
    );
});