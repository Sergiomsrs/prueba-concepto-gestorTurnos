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
        <div className="w-full">
            {/* Vista móvil: Stack vertical */}
            <div className="sm:hidden space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha inicio (Lunes)
                    </label>
                    <input
                        name="start"
                        type="date"
                        value={value.start}
                        onChange={handleInputChange}
                        className={`w-full border text-sm rounded-md px-3 py-2 h-[42px] ${error
                                ? "bg-red-50 border-red-500"
                                : "bg-gray-50 border-gray-300"
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha fin (Domingo)
                    </label>
                    <input
                        name="end"
                        type="date"
                        value={value.end}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-300 text-sm rounded-md px-3 py-2 h-[42px]"
                    />
                </div>

                {error && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">⚠️ {error}</p>
                    </div>
                )}
            </div>

            {/* Vista desktop: Inputs horizontales */}
            <div className="hidden sm:flex items-center gap-3">
                <input
                    name="start"
                    type="date"
                    value={value.start}
                    onChange={handleInputChange}
                    className={`flex-1 border text-sm rounded-md px-3 py-2 h-[42px] ${error
                            ? "bg-red-50 border-red-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                />

                <span className="text-gray-400 text-sm">→</span>

                <input
                    name="end"
                    type="date"
                    value={value.end}
                    readOnly
                    className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-md px-3 py-2 h-[42px]"
                />
            </div>

            {/* Mensaje de error y ayuda */}
            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-600">⚠️ {error}</p>
                </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
                💡 Selecciona un lunes para la semana completa
            </p>
        </div>
    );
};
