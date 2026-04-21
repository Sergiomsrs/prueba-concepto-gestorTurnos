import React, { useState, useEffect } from 'react';
import { usePlanner } from '../hooks/usePlanner';
import { EmployeeSelector } from '@/utilComponents/EmployeeSelector';
import { plannerService } from "../services/plannerService";

export const PlannerLayout = () => {
    const { status, solveMutation, confirmMutation, rejectMutation } = usePlanner();

    const [employees, setEmployees] = useState([]);
    const [absentId, setAbsentId] = useState("");
    const [range, setRange] = useState({ from: "", to: "" });
    const [proposal, setProposal] = useState(null);

    const [activeTab] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    useEffect(() => {
        if (status !== "SOLVING_ACTIVE" && (status === "NOT_SOLVING" || status === "SOLVING")) {
            handleViewProposal();
        }
    }, [status]);

    const handleSolve = () => {
        if (!absentId || !range.from || !range.to) {
            alert("Por favor, selecciona un empleado y el rango de fechas completo.");
            return;
        }
        setProposal(null);
        solveMutation.mutate({
            absentEmployeeId: absentId,
            from: range.from,
            to: range.to
        });
    };

    const handleViewProposal = async () => {
        try {
            const data = await plannerService.getProposal();
            setProposal(data);
        } catch (error) {
            console.error("Error al obtener la propuesta:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* --- HEADER PRINCIPAL --- */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-baseline gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Asistente de Sustituciones AI</h1>
                            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                v1.0 Live
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">Optimización inteligente basada en <strong>Timefold Solver</strong></p>
                    </div>
                </div>

                {/* --- PANEL DE CONFIGURACIÓN --- */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                            {/* Selector */}
                            <div className="lg:col-span-5 space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                                    Empleado Ausente
                                </label>
                                <EmployeeSelector
                                    employees={employees}
                                    setEmployees={setEmployees}
                                    selectedEmployeeId={absentId}
                                    setSelectedEmployeeId={setAbsentId}
                                    activeTab={activeTab}
                                />
                            </div>
                            {/* Fechas */}
                            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Desde</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        onChange={(e) => setRange({ ...range, from: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Hasta</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        onChange={(e) => setRange({ ...range, to: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* Botón */}
                            <div className="lg:col-span-3">
                                <button
                                    onClick={handleSolve}
                                    disabled={status === "SOLVING_ACTIVE" || !absentId || !range.from}
                                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${status === "SOLVING_ACTIVE"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                        }`}
                                >
                                    {status === "SOLVING_ACTIVE" ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Calculando...</span>
                                        </>
                                    ) : (
                                        "Calcular Sustituciones"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABLA DE RESULTADOS (SOLO SI HAY PROPUESTA) --- */}
                {proposal && proposal.length > 0 && status !== "SOLVING_ACTIVE" && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-6 sm:px-8 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Propuesta de Sustituciones</h3>
                                <p className="text-gray-600 text-sm mt-1">Se sugieren cambios para {proposal.length} turno{proposal.length > 1 ? 's' : ''}.</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => confirmMutation.mutate()}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all active:scale-95 text-sm"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => {
                                        // 1. Limpiamos la tabla visualmente
                                        setProposal(null);
                                        // 2. Avisamos al backend que limpie la memoria (HashMap)
                                        rejectMutation.mutate();
                                    }}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
                                >
                                    Descartar
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Fecha</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Horario</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Sustituto Propuesto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proposal.map((shift) => (
                                        <tr key={shift.shiftId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 font-semibold text-gray-900">{shift.date}</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                    {shift.startTime.substring(0, 5)} - {shift.endTime.substring(0, 5)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-blue-600">{shift.proposedEmployeeName}</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">ID: {shift.proposedEmployeeId}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};