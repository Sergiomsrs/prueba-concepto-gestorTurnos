import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchConditions } from "../services/wwhService";
import { fetchTwConditions } from "../services/teamWorkService";
import { fetchDisponibilities, fetchPto } from "../services/employees";

/**
 * Hook personalizado para hacer prefetch de todos los datos de un empleado
 * Esto previene los saltos feos cuando se expanden las secciones
 */
export const usePrefetchEmployeeData = () => {
    const queryClient = useQueryClient();

    const prefetchEmployeeData = useCallback(
        async (employeeId) => {
            if (!employeeId) return;

            // Prefetch todas las queries de una vez
            await Promise.all([
                queryClient.prefetchQuery({
                    queryKey: ["wwh", employeeId],
                    queryFn: () => fetchConditions.getWwhByEmployee(employeeId),
                    staleTime: 1000 * 60 * 5, // 5 minutos
                }),
                queryClient.prefetchQuery({
                    queryKey: ["teamwork", employeeId],
                    queryFn: () => fetchTwConditions.getTeamWorkByEmployee(employeeId),
                    staleTime: 1000 * 60 * 5,
                }),
                queryClient.prefetchQuery({
                    queryKey: ["disponibilities", employeeId],
                    queryFn: async () => {
                        const { status, data } = await fetchDisponibilities.getDisponibilities(employeeId);
                        return status === 204 ? [] : data;
                    },
                    staleTime: 1000 * 60 * 5,
                }),
                queryClient.prefetchQuery({
                    queryKey: ["pto", employeeId],
                    queryFn: async () => {
                        const { status, data } = await fetchPto.getPtoList(employeeId);
                        return status === 204 ? [] : data;
                    },
                    staleTime: 1000 * 60 * 5,
                }),
            ]);
        },
        [queryClient]
    );

    return { prefetchEmployeeData };
};
