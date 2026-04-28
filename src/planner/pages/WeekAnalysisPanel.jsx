import React, { useState, useEffect } from 'react';
import { useWeekPlanner } from '../hooks/useWeekPlanner';
import { AlertModal } from '@/timeTrack/components/AlertModal';

const PROGRESS_STEPS = [
    { id: 1, label: "Validando configuración", duration: 1500 },
    { id: 2, label: "Identificando conflictos", duration: 2500 },
    { id: 3, label: "Iniciando búsqueda de soluciones", duration: 2000 },
];

const ProgressCard = ({ isPending, triggerKey }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        setCurrentStep(0);
        setElapsed(0);

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
        <div className="bg-white border border-appPrimary-border rounded-lg overflow-hidden animate-fade-in">
            <div className="bg-appPrimary-light border-b border-appPrimary-border px-6 py-4">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-appPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <div>
                        <h3 className="text-gray-900 font-bold text-sm">
                            Analizando configuración de semana...
                        </h3>
                        <p className="text-gray-600 text-xs mt-0.5">
                            Timefold Solver evaluando disponibilidades y restricciones
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className="bg-appPrimary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="space-y-3">
                    {PROGRESS_STEPS.map((step, i) => {
                        const isDone = i < currentStep;
                        const isActive = i === currentStep;
                        return (
                            <div key={step.id} className="flex items-center gap-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isDone ? "bg-green-100" : isActive ? "bg-appPrimary-light" : "bg-gray-100"
                                    }`}>
                                    {isDone ? (
                                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isActive ? (
                                        <svg className={`w-3.5 h-3.5 text-appPrimary ${isPending ? "" : "animate-spin"}`} fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                    )}
                                </div>
                                <span className={`text-sm transition-all duration-300 ${isDone ? "text-green-700 font-medium" : isActive ? "text-appPrimary-text font-semibold" : "text-gray-400"
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

/**
 * WeekAnalysisPanel
 * 
 * Componente que maneja el flujo completo de análisis de semanas genéricas:
 * 1. Envía configuración al solver
 * 2. Monitoriza progreso
 * 3. Muestra propuestas de asignación
 * 4. Permite rechazar/confirmar candidatos
 * 5. Confirma la solución final
 */
export const WeekAnalysisPanel = ({ config, onClose, onSuccess }) => {
    const {
        status,
        proposal,
        isLoadingProposal,
        analyzeMutation,
        confirmMutation,
        rejectMutation,
        rejectShiftCandidateMutation,
    } = useWeekPlanner();

    const [rejectedByShift, setRejectedByShift] = useState({});
    const [progressKey, setProgressKey] = useState(0);
    const [modalMessage, setModalMessage] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resolvingShiftId, setResolvingShiftId] = useState(null);
    const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);

    const isSolving = status === "SOLVING_ACTIVE";
    const isLoading = isSolving || isLoadingProposal || analyzeMutation.isPending;
    const hasProposal = proposal && proposal.length > 0;

    // Auto-iniciar análisis cuando el componente monta
    useEffect(() => {
        if (config && !isSolving) {
            handleAnalyze();
        }
    }, []);

    // Mostrar propuesta cuando termina el solve
    useEffect(() => {
        if (!isSolving && (status === "NOT_SOLVING" || status === "SOLVED")) {
            // Pequeño delay para evitar race condition
            const timer = setTimeout(() => {
                // La propuesta ya está disponible via useWeekPlanner
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [status, isSolving]);

    // Manejo de confirmación exitosa
    useEffect(() => {
        if (confirmMutation.isSuccess) {
            setModalMessage({
                type: 'success',
                text: 'Semana asignada y guardada correctamente'
            });
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
                onSuccess?.();
            }, 2000);
        }
    }, [confirmMutation.isSuccess]);

    const handleAnalyze = () => {
        setHasStartedAnalysis(true);
        setProgressKey(k => k + 1);
        setRejectedByShift({});
        setResolvingShiftId(null);
        analyzeMutation.mutate(config);
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

    const handleConfirmAll = () => {
        if (!hasProposal || proposal.some(p => !p.solved)) {
            setModalMessage({
                type: 'warning',
                text: 'No pueden confirmarse turnos sin candidato asignado. Revisa los conflictos pendientes.'
            });
            setIsModalOpen(true);
            return;
        }
        setRejectedByShift({});
        setResolvingShiftId(null);
        confirmMutation.mutate();
    };

    const handleRejectAll = () => {
        setRejectedByShift({});
        setResolvingShiftId(null);
        rejectMutation.mutate();
    };

    const handleBack = () => {
        setRejectedByShift({});
        setResolvingShiftId(null);
        rejectMutation.mutate();
        onClose?.();
    };

    // Agrupar propuesta por empleado a sustituir
    const groupedByEmployee = proposal?.reduce((acc, shift) => {
        const empId = shift.originalEmployeeId ?? shift.originalEmployeeName;
        if (!acc[empId]) {
            acc[empId] = {
                employeeId: shift.originalEmployeeId,
                employeeName: shift.originalEmployeeName,
                shifts: []
            };
        }
        acc[empId].shifts.push(shift);
        return acc;
    }, {}) || {};

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-2xl font-bold text-gray-900">Análisis de Semana Genérica</h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Validando disponibilidades y optimizando asignaciones con <strong>Timefold Solver</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleBack}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Cerrar panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* TARJETA DE PROGRESO */}
                {isLoading && (
                    <div className="mb-6">
                        <ProgressCard
                            isPending={isSolving}
                            triggerKey={progressKey}
                        />
                    </div>
                )}

                {/* RESULTADOS: TARJETAS POR EMPLEADO */}
                {hasProposal && !isLoading && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Header con acciones globales */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-indigo-50 px-6 sm:px-8 py-4 border-b border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Propuesta de Asignaciones</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {Object.keys(groupedByEmployee).length} empleado(s) con {proposal.length} turno(s) asignado(s)
                                    </p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleConfirmAll}
                                        disabled={confirmMutation.isPending}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all active:scale-95 text-sm"
                                    >
                                        {confirmMutation.isPending ? "Guardando..." : "Confirmar y Guardar"}
                                    </button>
                                    <button
                                        onClick={handleRejectAll}
                                        disabled={rejectMutation.isPending}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all text-sm"
                                    >
                                        {rejectMutation.isPending ? "Rechazando..." : "Descartar"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid de tarjetas por empleado */}
                        <div className="grid grid-cols-1 gap-6">
                            {Object.values(groupedByEmployee).map((employeeGroup) => {
                                const totalShifts = employeeGroup.shifts.length;
                                const unsolvedShifts = employeeGroup.shifts.filter(s => !s.solved).length;

                                return (
                                    <div
                                        key={employeeGroup.employeeId}
                                        className="bg-white border border-indigo-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Header de empleado */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">
                                                        👤 {employeeGroup.employeeName}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        ID: {employeeGroup.employeeId}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-indigo-600">{totalShifts}</div>
                                                    <p className="text-xs text-gray-600">turno{totalShifts !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lista de turnos */}
                                        <div className="divide-y divide-gray-100">
                                            {employeeGroup.shifts.map((shift) => {
                                                const isBeingResolved = resolvingShiftId === shift.shiftId;
                                                const rejected = rejectedByShift[shift.shiftId] || [];

                                                return (
                                                    <div
                                                        key={shift.shiftId}
                                                        className={`p-4 transition-colors ${isBeingResolved
                                                            ? "bg-blue-50"
                                                            : !shift.solved
                                                                ? "bg-yellow-50"
                                                                : ""
                                                            }`}
                                                    >
                                                        <div className="space-y-2">
                                                            {/* Fecha y horario */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-gray-900">
                                                                    📅 {shift.dateStr}
                                                                </span>
                                                                <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                                                                    {shift.startTime?.substring(0, 5)} - {shift.endTime?.substring(0, 5)}
                                                                </span>
                                                            </div>

                                                            {/* Empleado sustituto y razón del conflicto */}
                                                            <div className="text-sm">
                                                                <p className="text-gray-600">
                                                                    <span className="font-medium">Sustituido por:</span> {shift.proposedEmployeeName || "Sin candidato"}
                                                                </p>
                                                                <p className="text-xs text-orange-600 mt-0.5">
                                                                    ⚠️ Motivo: <span className="font-medium">{shift.conflictReason}</span>
                                                                </p>
                                                            </div>

                                                            {/* Estado */}
                                                            {isBeingResolved ? (
                                                                <div className="flex items-center gap-2 text-blue-600 py-1">
                                                                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                    </svg>
                                                                    <span className="text-xs font-medium">Buscando alternativa...</span>
                                                                </div>
                                                            ) : !shift.solved ? (
                                                                <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded border border-amber-200 inline-block">
                                                                    ⚠️ Sin candidatos disponibles
                                                                </div>
                                                            ) : null}

                                                            {/* Candidatos rechazados */}
                                                            {rejected.length > 0 && (
                                                                <div className="pt-2 border-t border-gray-200">
                                                                    <p className="text-xs text-gray-600 font-medium mb-1">Rechazados anteriormente:</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {rejected.map((r) => (
                                                                            <span
                                                                                key={r.id}
                                                                                className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200"
                                                                            >
                                                                                ✗ {r.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Botón de rechazar candidato */}
                                                            {!isBeingResolved && shift.solved && shift.proposedEmployeeId && (
                                                                <div className="pt-2">
                                                                    <button
                                                                        onClick={() => handleRejectCandidate(shift)}
                                                                        disabled={rejectShiftCandidateMutation.isPending}
                                                                        className="w-full text-xs text-center py-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium transition-colors rounded border border-indigo-200 hover:border-indigo-300 disabled:opacity-40"
                                                                    >
                                                                        🔄 Proponer otro candidato
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ESTADO PLACEHOLDER */}
                {(hasStartedAnalysis && !hasProposal && !isLoading) && (
                    <div className="bg-white border border-gray-200 rounded-lg min-h-[320px] flex items-center justify-center px-6 py-10 animate-fade-in">
                        <div className="max-w-lg text-center">
                            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l6-6m0 0l-6-6m6 6H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Análisis completado</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                La semana ha sido procesada correctamente.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <AlertModal isOpen={isModalOpen} message={modalMessage} />
        </div>
    );
};
