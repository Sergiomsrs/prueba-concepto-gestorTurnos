import { memo, useRef, useState, useCallback, useMemo } from "react";

export const EmployeeRow = memo(({ employee, dayIndex, employeeIndex, dispatch, numRows }) => {
    const inputRefs = useRef([]);
    const [lastFocusedIndex, setLastFocusedIndex] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startSelection, setStartSelection] = useState(null);

    const handleMouseDown = useCallback((index, currentValue) => {
        setIsSelecting(true);
        setStartSelection(index);

        dispatch({
            type: "UPDATE_SHIFT_RANGE",
            payload: { dayIndex, employeeIndex, startIndex: index, endIndex: index, value: currentValue !== "WORK" }
        });
    }, [dayIndex, employeeIndex, dispatch]);

    const handleMouseEnter = useCallback((index) => {
        if (!isSelecting || startSelection === null) return;

        const selectionStart = Math.min(startSelection, index);
        const selectionEnd = Math.max(startSelection, index);

        const baseValue = employee.workShift[startSelection] !== "WORK";

        dispatch({
            type: "UPDATE_SHIFT_RANGE",
            payload: { dayIndex, employeeIndex, startIndex: selectionStart, endIndex: selectionEnd, value: baseValue }
        });
    }, [isSelecting, startSelection, dayIndex, employeeIndex, dispatch, employee.workShift]);

    const handleMouseUp = useCallback(() => {
        setIsSelecting(false);
        setStartSelection(null);
    }, []);

    const handleKeyDown = useCallback((event, colIndex) => {
        setLastFocusedIndex(colIndex);

        let newIndex = null;
        if (event.key === "ArrowRight") newIndex = colIndex + 1;
        if (event.key === "ArrowLeft") newIndex = colIndex - 1;
        if (event.key === "ArrowDown") newIndex = colIndex; // focus matrix handling in parent
        if (event.key === "ArrowUp") newIndex = colIndex;   // focus matrix handling in parent

        if (newIndex !== null && inputRefs.current[newIndex]) {
            inputRefs.current[newIndex].focus();
            event.preventDefault();
        }

        if ((event.key === " " || event.key === "Enter")) {
            dispatch({
                type: "UPDATE_SHIFT",
                payload: { dayIndex, employeeIndex, hourIndex: colIndex }
            });
            event.preventDefault();
        }
    }, [dayIndex, employeeIndex, dispatch]);

    const totalHours = useMemo(() => {
        return (employee.workShift.filter(w => w === "WORK").length * 15) / 60;
    }, [employee.workShift]);

    return (
        <>
            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-800 border-r flex items-center">
                <span className="truncate">{employee.teamWork}</span>
            </div>
            <div className="bg-white px-3 py-2 text-sm text-gray-700 border-r flex items-center">
                <span className="truncate">{employee.name} {employee.lastName}</span>
            </div>
            {employee.workShift.map((workshift, hourIndex) => (
                <div
                    key={hourIndex}
                    className="bg-white flex items-center justify-center p-0.5"
                    onMouseEnter={() => handleMouseEnter(hourIndex)}
                    onMouseUp={handleMouseUp}
                >
                    <input
                        ref={el => inputRefs.current[hourIndex] = el}
                        type="checkbox"
                        checked={workshift === "WORK"}
                        onMouseDown={() => handleMouseDown(hourIndex, workshift)}
                        onChange={() => { }}
                        onKeyDown={(e) => handleKeyDown(e, hourIndex)}
                        className={`w-4 h-4 rounded border-gray-300 cursor-pointer ${workshift === "WORK" ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    />
                </div>
            ))}
            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-700 border-l text-center">
                {totalHours.toFixed(2)}
            </div>
        </>
    );
});
