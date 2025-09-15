import React, { useState } from "react";

export const DateRangePicker = ({ value = { start: "", end: "" }, onChange }) => {
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value: inputValue } = e.target;
        let newRange = { ...value };

        if (name === "start") {
            if (inputValue) {
                const startDate = new Date(inputValue);
                if (startDate.getDay() !== 1) {
                    setError("Solo puedes seleccionar lunes.");
                    newRange.start = inputValue;
                    newRange.end = "";
                } else {
                    setError("");
                    newRange.start = inputValue;
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    newRange.end = endDate.toISOString().slice(0, 10);
                }
            } else {
                setError("");
                newRange.start = "";
                newRange.end = "";
            }
        }

        onChange?.(newRange);
    };

    return (
        <div className="flex flex-col items-start gap-2" id="date-range-picker">
            <div className="flex items-center w-full">
                <input
                    id="datepicker-range-start"
                    name="start"
                    type="date"
                    value={value.start}
                    onChange={handleInputChange}
                    className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${error ? "bg-red-200 border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Select date start"
                />
                <span className="mx-4 text-gray-500">a</span>
                <input
                    id="datepicker-range-end"
                    name="end"
                    type="date"
                    value={value.end}
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Select date end"
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
