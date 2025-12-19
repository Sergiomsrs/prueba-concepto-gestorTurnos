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
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [activeTab, setActiveTab] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(), // 0-11
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar mensaje al editar
        if (message.text) setMessage({ type: "", text: "" });
    };

    const handleEmployeeChange = (id) => {
        setForm((prev) => ({
            ...prev,
            employeeId: id,
        }));
        if (message.text) setMessage({ type: "", text: "" });
    };

    const calculateDuration = () => {
        if (!form.startTime || !form.endTime) return null;

        const [startHour, startMin] = form.startTime.split(":").map(Number);
        const [endHour, endMin] = form.endTime.split(":").map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        const diffMinutes = endMinutes - startMinutes;

        if (diffMinutes <= 0) return null;

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return { hours, minutes, total: diffMinutes / 60 };
    };

    const duration = calculateDuration();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setIsSubmitting(true);

        // Validación adicional
        if (!form.employeeId || !form.date || !form.startTime || !form.endTime) {
            setMessage({ type: "error", text: "Por favor, completa todos los campos." });
            setIsSubmitting(false);
            return;
        }

        if (!duration || duration.total <= 0) {
            setMessage({ type: "error", text: "La hora de fin debe ser posterior a la hora de inicio." });
            setIsSubmitting(false);
            return;
        }

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
            setMessage({ type: "success", text: "✓ Turno guardado correctamente" });

            // Resetear formulario después de 2 segundos
            setTimeout(() => {
                setForm({
                    employeeId: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                });
                setMessage({ type: "", text: "" });
            }, 2000);
        } catch (error) {
            setMessage({ type: "error", text: "✗ Error al guardar el turno. Inténtalo de nuevo." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Turno</h1>
                    <p className="text-gray-600">Asigna un turno individual a un empleado</p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Selector de empleado */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Empleado
                            </label>
                            <EmployeeSelector
                                employees={employees}
                                setEmployees={setEmployees}
                                selectedEmployeeId={form.employeeId}
                                setSelectedEmployeeId={handleEmployeeChange}
                                activeTab={activeTab}
                            />
                        </div>

                        {/* Fecha */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700" htmlFor="date">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Fecha del turno
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>

                        {/* Horarios */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Hora inicio */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700" htmlFor="startTime">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hora de inicio
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    step="900"
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* Hora fin */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700" htmlFor="endTime">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hora de fin
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    step="900"
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Duración calculada */}
                        {duration && duration.total > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900">Duración del turno</p>
                                        <p className="text-lg font-bold text-blue-700">
                                            {duration.hours > 0 && `${duration.hours}h `}
                                            {duration.minutes > 0 && `${duration.minutes}min`}
                                            <span className="text-sm font-normal text-blue-600 ml-2">
                                                ({duration.total.toFixed(2)} horas)
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensaje de feedback */}
                        {message.text && (
                            <div className={`rounded-lg p-4 ${message.type === "success"
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "success" ? "bg-green-100" : "bg-red-100"
                                        }`}>
                                        {message.type === "success" ? (
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className={`text-sm font-medium ${message.type === "success" ? "text-green-800" : "text-red-800"
                                        }`}>
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botón de submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-base font-semibold text-white transition-all shadow-lg ${isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Guardar Turno
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer informativo */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>
                                Los horarios se ajustan automáticamente a intervalos de 15 minutos.
                                El turno quedará registrado inmediatamente tras guardar.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card de ayuda opcional */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Consejos
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Verifica que el empleado no tenga otro turno en el mismo horario
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Los turnos solo se pueden registrar en intervalos de 15 minutos
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Puedes editar turnos existentes desde el panel de cuadrantes
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};