import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPreferences, fetchSkills } from "../services/employees";

export const useEmployeePreferences = (employeeId) => {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");

    // ── Skills disponibles en la empresa ──────────────────────────────────
    const { data: availableSkills = [], isLoading: loadingSkills } = useQuery({
        queryKey: ["skills"],
        queryFn: async () => {
            const { status, data } = await fetchSkills.getSkills();
            return status === 204 ? [] : data;
        },
        staleTime: 1000 * 60 * 10, // las skills cambian poco
    });

    // ── Preferencias del empleado ──────────────────────────────────────────
    const { data: preferences, isLoading: loadingPrefs } = useQuery({
        queryKey: ["preferences", employeeId],
        queryFn: async () => {
            const { status, data } = await fetchPreferences.getPreferences(employeeId);
            return status === 204 ? null : data;
        },
        enabled: !!employeeId,
        staleTime: 1000 * 60 * 5,
    });

    // ── Guardar preferencias ───────────────────────────────────────────────
    const savePreferencesMutation = useMutation({
        mutationFn: fetchPreferences.savePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["preferences", employeeId] });
            setMessage("Preferencias guardadas correctamente.");
            setTimeout(() => setMessage(""), 3000);
        },
        onError: () => setMessage("Error al guardar las preferencias."),
    });

    // ── Crear skill de empresa ─────────────────────────────────────────────
    const createSkillMutation = useMutation({
        mutationFn: fetchSkills.createSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
        },
        onError: () => setMessage("Error al crear la skill."),
    });

    // ── Eliminar skill de empresa ──────────────────────────────────────────
    const deleteSkillMutation = useMutation({
        mutationFn: fetchSkills.deleteSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            // Refrescar preferencias porque una skill borrada puede estar asignada
            queryClient.invalidateQueries({ queryKey: ["preferences", employeeId] });
        },
        onError: () => setMessage("Error al eliminar la skill."),
    });

    return {
        // Datos
        availableSkills,
        preferences,
        message,
        // Estados de carga
        isLoading: loadingSkills || loadingPrefs,
        isSaving: savePreferencesMutation.isPending,
        // Handlers
        handleSavePreferences: (data) =>
            savePreferencesMutation.mutate({ employeeId, ...data }),
        handleCreateSkill: createSkillMutation.mutate,
        handleDeleteSkill: deleteSkillMutation.mutate,
        setMessage,
    };
};