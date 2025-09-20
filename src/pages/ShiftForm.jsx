import React, { useState } from "react";
import { fetchShift } from "../services/shiftService";
import { EmployeeSelector } from "../utilComponents/EmployeeSelector";

function floorToQuarterHour(time) {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const floored = Math.floor(minute / 15) * 15;
    return `${hour.toString().padStart(2, "0")}:${floored.toString().padStart(2, "0")}`;
}

export const ShiftForm = () => {
    const [form, setForm] = useState({
        employeeId: "",
        date: "",
        startTime: "",
        endTime: "",
    });
    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEmployeeChange = (id) => {
        setForm((prev) => ({
            ...prev,
            employeeId: id,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Ajusta siempre hacia abajo
        const flooredStart = floorToQuarterHour(form.startTime);
        const flooredEnd = floorToQuarterHour(form.endTime);

        try {
            await fetchShift.saveIndividualShift({
                employeeId: Number(form.employeeId),
                date: form.date,
                startTime: flooredStart,
                endTime: flooredEnd,
            });
            setMessage("Turno guardado correctamente.");
            setForm({
                employeeId: "",
                date: "",
                startTime: "",
                endTime: "",
            });
        } catch (error) {
            setMessage("Error al guardar el turno.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 space-y-4 ">
            <EmployeeSelector
                employees={employees}
                setEmployees={setEmployees}
                selectedEmployeeId={form.employeeId}
                setSelectedEmployeeId={handleEmployeeChange}
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                    Fecha
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startTime">
                    Hora de inicio
                </label>
                <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    step="900" // <-- Solo permite intervalos de 15 minutos
                    className="block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endTime">
                    Hora de fin
                </label>
                <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    step="900" // <-- Solo permite intervalos de 15 minutos
                    className="block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
                Guardar turno
            </button>
            {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}
        </form>
    );
};