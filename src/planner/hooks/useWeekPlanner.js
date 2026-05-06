import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weekPlannerService } from "../services/weekPlannerService";

export const useWeekPlanner = () => {
    const queryClient = useQueryClient();

    // 1. Estado del Solver (con polling inteligente)
    const { data: status } = useQuery({
        queryKey: ["week-solver-status"],
        queryFn: weekPlannerService.getStatus,
        refetchInterval: (query) =>
            query.state.data === "SOLVING_ACTIVE" ? 2000 : false,
    });

    // 2. Obtener la Propuesta (solo se activa si NO está resolviendo)
    const { data: proposal, isLoading: isLoadingProposal } = useQuery({
        queryKey: ["week-proposal"],
        queryFn: weekPlannerService.getProposal,
        enabled: status !== "SOLVING_ACTIVE" && status !== undefined,
    });

    // 4. Mutación para Confirmar (ANTES de analyzeMutation para poder referenciarla)
    const confirmMutation = useMutation({
        mutationFn: weekPlannerService.confirm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["roster"] });
            queryClient.setQueryData(["week-proposal"], null);
        },
    });

    // 3. Mutación para Analizar
    const analyzeMutation = useMutation({
        mutationFn: (dto) => weekPlannerService.analyze(dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });

            // Sin conflictos → confirmar automáticamente para persistir los turnos limpios
            if (data.conflictsDetected === 0) {
                confirmMutation.mutate();
            }
        },
        onError: (error) => {
            console.error("Error al iniciar análisis semanal:", error);
        }
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