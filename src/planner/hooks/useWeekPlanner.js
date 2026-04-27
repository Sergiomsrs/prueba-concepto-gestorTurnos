import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weekPlannerService } from "../services/weekPlannerService";

export const useWeekPlanner = () => {
    const queryClient = useQueryClient();

    // 1. Estado del Solver (con polling inteligente)
    const { data: status } = useQuery({
        queryKey: ["week-solver-status"],
        queryFn: weekPlannerService.getStatus,
        // Si el estado es "SOLVING_ACTIVE", consulta cada 2 segundos 
        refetchInterval: (query) =>
            query.state.data === "SOLVING_ACTIVE" ? 2000 : false,
    });

    // 2. Obtener la Propuesta (solo se activa si NO está resolviendo)
    const { data: proposal, isLoading: isLoadingProposal } = useQuery({
        queryKey: ["week-proposal"],
        queryFn: weekPlannerService.getProposal,
        enabled: status !== "SOLVING_ACTIVE" && status !== undefined,
    });

    // 3. Mutación para Analizar (Sustituye a 'solve')
    const analyzeMutation = useMutation({
        mutationFn: (dto) => weekPlannerService.analyze(dto),
        onSuccess: () => {
            // Invalidamos estado para activar el polling 
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
        },
        onError: (error) => {
            console.error("Error al iniciar análisis semanal:", error);
        }
    });

    // 4. Mutación para Confirmar
    const confirmMutation = useMutation({
        mutationFn: weekPlannerService.confirm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["roster"] }); // Refresca el calendario general
            queryClient.setQueryData(["week-proposal"], null); // Limpiamos la propuesta tras confirmar
        },
    });

    // 5. Mutación para Rechazar toda la propuesta
    const rejectMutation = useMutation({
        mutationFn: weekPlannerService.reject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.setQueryData(["week-proposal"], null);
        },
    });

    // 6. Mutación para Rechazar un candidato específico
    const rejectShiftCandidateMutation = useMutation({
        mutationFn: ({ shiftId, excludeEmployeeId }) =>
            weekPlannerService.rejectShiftCandidate({ shiftId, excludeEmployeeId }),
        onSuccess: () => {
            // Tras rechazar un candidato, el backend suele re-calcular
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
        },
    });

    return {
        status,
        proposal,
        isLoadingProposal,
        analyzeMutation,
        confirmMutation,
        rejectMutation,
        rejectShiftCandidateMutation
    };
};