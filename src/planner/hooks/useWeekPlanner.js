import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weekPlannerService } from "../services/weekPlannerService";

export const useWeekPlanner = () => {
    const queryClient = useQueryClient();

    // Estado del solver de semana
    const { data: status, isLoading: statusLoading } = useQuery({
        queryKey: ["week-solver-status"],
        queryFn: weekPlannerService.status,
        refetchInterval: (query) => (query.state.data === "SOLVING_ACTIVE" ? 2000 : false),
    });

    // Propuesta actual de conflictos
    const { data: proposal, isLoading: proposalLoading } = useQuery({
        queryKey: ["week-solver-proposal"],
        queryFn: weekPlannerService.getProposal,
        enabled: false, // Solo se ejecuta cuando se llama manualmente
    });

    // Mutation para analizar la semana
    const analyzeMutation = useMutation({
        mutationFn: (dto) => weekPlannerService.analyze(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["week-solver-proposal"] });
        },
        onError: (error) => {
            console.error("Error al analizar semana:", error);
        }
    });

    // Mutation para confirmar propuesta
    const confirmMutation = useMutation({
        mutationFn: weekPlannerService.confirm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["week-solver-proposal"] });
            queryClient.invalidateQueries({ queryKey: ["roster"] });
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
        },
        onError: (error) => {
            console.error("Error al confirmar propuesta:", error);
        }
    });

    // Mutation para rechazar propuesta
    const rejectMutation = useMutation({
        mutationFn: weekPlannerService.reject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["week-solver-proposal"] });
        },
        onError: (error) => {
            console.error("Error al rechazar propuesta:", error);
        }
    });

    // Mutation para rechazar candidato específico para un turno
    const rejectShiftCandidateMutation = useMutation({
        mutationFn: (variables) => weekPlannerService.rejectShiftCandidate(variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["week-solver-proposal"] });
        },
        onError: (error) => {
            console.error("Error al rechazar candidato de turno:", error);
        }
    });

    return {
        // Queries
        status,
        statusLoading,
        proposal,
        proposalLoading,

        // Mutations
        analyzeMutation,
        confirmMutation,
        rejectMutation,
        rejectShiftCandidateMutation,
    };
};
