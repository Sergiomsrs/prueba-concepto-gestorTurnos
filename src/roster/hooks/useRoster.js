import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRosterBetweenDates, saveRosterData } from "../services/rosterService";
import { AuthContext } from "@/timeTrack/context/AuthContext";
import { apiMockData } from "../../utils/apiMock";

export const useRoster = (startDate, endDate) => {
    const { auth } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const isDemo = auth.token === "demo-token-12345";

    const rosterQuery = useQuery({
        queryKey: ["roster", startDate, endDate],
        queryFn: async () => {
            // Manejo del mock para modo demo
            if (auth.token === "demo-token-12345") return apiMockData;

            const result = await fetchRosterBetweenDates(startDate, endDate, auth.token);
            if (!result.success) throw new Error(result.message);
            return result.data;
        },
        initialData: isDemo ? apiMockData : undefined,

        // 🛡️ LÓGICA DE VALIDACIÓN AQUÍ
        enabled: (() => {
            if (isDemo) return true; // En modo demo siempre habilitado
            if (!startDate || !endDate) return false;

            const inicio = new Date(startDate);
            const fin = new Date(endDate);

            // 1. Validar que inicio no sea superior a fin
            if (inicio > fin) return false;

            // 2. Validar que la diferencia no supere los 35 días
            const diffInMs = fin.getTime() - inicio.getTime();
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

            return diffInDays <= 35;
        })(),

        staleTime: 1000 * 60 * 5,
    });

    // 2️⃣ MUTATION: Guardado de datos
    const saveMutation = useMutation({
        mutationFn: async (modifiedData) => {
            if (!modifiedData?.length) throw new Error("No hay datos para guardar");

            const result = await saveRosterData(modifiedData, auth.token);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: () => {
            // Invalida la caché para que se refresque la tabla automáticamente
            queryClient.invalidateQueries({ queryKey: ["roster"] });
        },
    });

    return {
        // Datos y Estados (TanStack ya nos da isLoading, error, etc)
        apiData: rosterQuery.data || [],
        loading: rosterQuery.isLoading || saveMutation.isPending,
        error: rosterQuery.error?.message || saveMutation.error?.message,

        // Acciones
        getRosterBetweenDates: rosterQuery.refetch, // Por si quieres forzar recarga
        saveData: saveMutation.mutateAsync,

        // Helpers de estado de la mutación
        saveStatus: {
            isSuccess: saveMutation.isSuccess,
            isError: saveMutation.isError,
            reset: saveMutation.reset
        }
    };
};