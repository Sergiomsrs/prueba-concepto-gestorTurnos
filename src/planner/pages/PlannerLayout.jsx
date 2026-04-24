import React, { useState, useEffect } from 'react';
import { usePlanner } from '../hooks/usePlanner';
import { EmployeeSelector } from '@/utilComponents/EmployeeSelector';
import { plannerService } from "../services/plannerService";

const PROGRESS_STEPS = [
    { id: 1, label: "Analizando candidatos", duration: 2000 },
    { id: 2, label: "Evaluando restricciones", duration: 3000 },
    { id: 3, label: "Optimizando solución", duration: 3000 },
];

const ProgressCard = ({ resolveShiftId, triggerKey, isPending }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        setCurrentStep(0);
        setElapsed(0);

        // Si isPending, no arrancar la animación — quedarse en paso 0 estático
        if (isPending) return;

        const interval = setInterval(() => setElapsed(prev => prev + 100), 100);
        const stepTimers = PROGRESS_STEPS.map((_, i) => {
            const delay = PROGRESS_STEPS.slice(0, i).reduce((acc, s) => acc + s.duration, 0);
            return setTimeout(() => setCurrentStep(i), delay);
        });
        return () => {
            clearInterval(interval);
            stepTimers.forEach(clearTimeout);
        };
    }, [triggerKey, isPending]);

    const totalDuration = PROGRESS_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const progress = isPending ? 0 : Math.min((elapsed / totalDuration) * 100, 95);

    return (
        <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <div>
                        <h3 className="text-white font-bold text-sm">
                            {resolveShiftId ? "Buscando candidato alternativo..." : "Calculando sustituciones óptimas..."}
                        </h3>
                        <p className="text-blue-200 text-xs mt-0.5">
                            Timefold Solver evaluando {resolveShiftId ? "el turno seleccionado" : "todos los turnos"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="space-y-3">
                    {PROGRESS_STEPS.map((step, i) => {
                        const isDone = i < currentStep;
                        const isActive = i === currentStep;
                        return (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isDone ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100"
                                    }`}>
                                    {isDone ? (
                                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isActive ? (
                                        <svg className={`w-3.5 h-3.5 text-blue-600 ${isPending ? "" : "animate-spin"}`} fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                    )}
                                </div>
                                <span className={`text-sm transition-all duration-300 ${isDone ? "text-green-700 font-medium" : isActive ? "text-blue-700 font-semibold" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const PlannerLayout = () => {
    const { status, solveMutation, confirmMutation, rejectMutation, rejectShiftCandidateMutation } = usePlanner();

    const [employees, setEmployees] = useState([]);
    const [absentId, setAbsentId] = useState("");
    const [range, setRange] = useState({ from: "", to: "" });
    const [proposal, setProposal] = useState(null);
    const [resolvingShiftId, setResolvingShiftId] = useState(null);
    const [rejectedByShift, setRejectedByShift] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progressKey, setProgressKey] = useState(0);

    const [activeTab] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    const isSolving = status === "SOLVING_ACTIVE";
    const isLoading = isSolving || isSubmitting;

    useEffect(() => {
        if (!isSolving && (status === "NOT_SOLVING" || status === "SOLVING")) {
            handleViewProposal();
        }
    }, [status]);

    const handleViewProposal = async () => {
        try {
            const data = await plannerService.getProposal();
            setProposal(data);
            setResolvingShiftId(null);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error al obtener la propuesta:", error);
            setIsSubmitting(false);
        }
    };

    const handleSolve = () => {
        if (!absentId || !range.from || !range.to) {
            alert("Por favor, selecciona un empleado y el rango de fechas completo.");
            return;
        }
        setProposal(null);
        setRejectedByShift({});
        setResolvingShiftId(null);
        setIsSubmitting(true);
        setProgressKey(k => k + 1);
        solveMutation.mutate(
            { absentEmployeeId: absentId, from: range.from, to: range.to },
            { onSettled: () => setIsSubmitting(false) }
        );
    };

    const handleRejectCandidate = (shift) => {
        setRejectedByShift(prev => ({
            ...prev,
            [shift.shiftId]: [
                ...(prev[shift.shiftId] || []),
                { id: shift.proposedEmployeeId, name: shift.proposedEmployeeName }
            ]
        }));
        setResolvingShiftId(shift.shiftId);
        setProgressKey(k => k + 1);
        rejectShiftCandidateMutation.mutate({
            shiftId: shift.shiftId,
            excludeEmployeeId: shift.proposedEmployeeId
        });
    };

    const handleRejectAll = () => {
        setProposal(null);
        setRejectedByShift({});
        setResolvingShiftId(null);
        rejectMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-baseline gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Asistente de Sustituciones AI</h1>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Optimización inteligente basada en <strong>Timefold Solver</strong>
                        </p>
                    </div>
                </div>

                {/* PANEL DE CONFIGURACIÓN */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

                            {/* Selector empleado */}
                            <div className="lg:col-span-5 space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
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
                                        className="w-full h-[38px] px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        onChange={(e) => setRange({ ...range, from: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Hasta</label>
                                    <input
                                        type="date"
                                        className="w-full h-[38px] px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        onChange={(e) => setRange({ ...range, to: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Botón */}
                            <div className="lg:col-span-3">
                                <button
                                    onClick={handleSolve}
                                    disabled={isLoading || !absentId || !range.from}
                                    className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 ${isLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Calculando...</span>
                                        </>
                                    ) : "Calcular Sustituciones"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TARJETA DE PROGRESO */}
                {isLoading && (
                    <div className="mb-6">
                        <ProgressCard
                            resolveShiftId={resolvingShiftId}
                            triggerKey={progressKey}
                            isPending={isSubmitting && !isSolving}
                        />
                    </div>
                )}

                {/* TABLA DE RESULTADOS */}
                {proposal && proposal.length > 0 && !isLoading && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-6 sm:px-8 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Propuesta de Sustituciones</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Se sugieren cambios para {proposal.length} turno{proposal.length > 1 ? "s" : ""}.
                                </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => confirmMutation.mutate()}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-appPrimary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all active:scale-95 text-sm"                                >
                                    Confirmar todo
                                </button>
                                <button
                                    onClick={handleRejectAll}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-white text-appPrimary border border-appPrimary-border hover:bg-appPrimary-light rounded-lg font-semibold transition-all text-sm"                                >
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
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Sustituto propuesto</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Descartados</th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proposal.map((shift) => {
                                        const isBeingResolved = resolvingShiftId === shift.shiftId;
                                        const rejected = rejectedByShift[shift.shiftId] || [];
                                        return (
                                            <tr key={shift.shiftId} className={`transition-colors ${isBeingResolved ? "bg-blue-50" : "hover:bg-gray-50"
                                                }`}>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {shift.date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                        {shift.startTime.substring(0, 5)} - {shift.endTime.substring(0, 5)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isBeingResolved ? (
                                                        <div className="flex items-center gap-2 text-blue-600">
                                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                            <span className="text-sm font-medium">Buscando alternativa...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-blue-600">{shift.proposedEmployeeName}</span>
                                                            <span className="text-xs text-gray-400 mt-0.5">ID: {shift.proposedEmployeeId}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rejected.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {rejected.map((r) => (
                                                                <span
                                                                    key={r.id}
                                                                    title={`ID: ${r.id}`}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-100"
                                                                >
                                                                    {r.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {!isBeingResolved && shift.proposedEmployeeId && (
                                                        <button
                                                            onClick={() => handleRejectCandidate(shift)}
                                                            disabled={rejectShiftCandidateMutation.isPending}
                                                            className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors disabled:opacity-40 whitespace-nowrap"
                                                        >
                                                            Proponer otro →
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};