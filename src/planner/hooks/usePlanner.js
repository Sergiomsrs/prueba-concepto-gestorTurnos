import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plannerService } from "../services/plannerService";

export const usePlanner = () => {
    const queryClient = useQueryClient();

    const { data: status } = useQuery({
        queryKey: ["solver-status"],
        queryFn: plannerService.getStatus,
        // En v5, el argumento es un objeto con la propiedad state
        refetchInterval: (query) => (query.state.data === "SOLVING_ACTIVE" ? 2000 : false),
    });

    const solveMutation = useMutation({
        // CORRECCIÓN: Envuelve la llamada para asegurar el paso de parámetros
        mutationFn: (variables) => plannerService.solve(variables),
        onSuccess: () => {
            // Forzamos refetch inmediato para que el botón cambie a "Optimizando"
            queryClient.invalidateQueries({ queryKey: ["solver-status"] });
        },
        onError: (error) => {
            console.error("Error al lanzar el solver:", error);
        }
    });

    const confirmMutation = useMutation({
        mutationFn: plannerService.confirm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solver-status"] });
            queryClient.invalidateQueries({ queryKey: ["roster"] });
            alert("Sustituciones aplicadas correctamente");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: plannerService.reject,
        onSuccess: () => {
            // Invalidamos el estado para que vuelva a IDLE/NOT_SOLVING
            queryClient.invalidateQueries({ queryKey: ["solver-status"] });
        },
    });

    const rejectShiftCandidateMutation = useMutation({
        mutationFn: (variables) => plannerService.rejectShiftCandidate(variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solver-status"] });
        },
        onError: (error) => {
            console.error("Error al rechazar candidato:", error);
        }
    });

    return { status, solveMutation, confirmMutation, rejectMutation, rejectShiftCandidateMutation };
};