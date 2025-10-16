import { memo, useCallback } from 'react';

export const ShiftInputs = memo(({ workShift, onShiftToggle, isModified }) => {
    return (
        <div className={`flex gap-1 p-1 rounded ${isModified ? 'bg-yellow-100' : ''}`}>
            {workShift?.map((shift, hourIndex) => (
                <ShiftCheckbox
                    key={hourIndex}
                    hourIndex={hourIndex}
                    isChecked={shift === "WORK"}
                    onToggle={onShiftToggle}
                />
            ))}
        </div>
    );
});