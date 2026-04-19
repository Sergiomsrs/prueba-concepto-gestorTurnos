import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { employess, generateData, generateShiftData, generateModifiedShiftData } from "../utils/shiftGeneratorData";
import {
    createByGenericShift,
    deleteRole,
    getCycle,
    getDefaultRoles,
    getRoles,
    toggleShiftRole
} from "../services/genericShiftService";

import { rolesMock } from "@/utils/apiMock";
import { AuthContext } from "@/timeTrack/context/AuthContext";
import { axiosClient } from "@/services/axiosClient";

export const useCyclesGenerator = () => {
    const queryClient = useQueryClient();
    const { auth } = useContext(AuthContext);

    const [data, setData] = useState(
        auth.token === "demo-token-12345" ? generateData(1, employess) : []
    );
    const [ciclo, setCiclo] = useState("");

    const { data: roles = rolesMock, refetch: refetchRoles } = useQuery({
        queryKey: ["roles", auth.token],
        queryFn: () => getRoles(auth.token),
        enabled: !!auth.token && auth.token !== "demo-token-12345",
        initialData: auth.token === "demo-token-12345" ? rolesMock : undefined,
    });

    const { data: defaultRoles = [], refetch: refetchDefaults } = useQuery({
        queryKey: ["defaultRoles", auth.token],
        queryFn: () => getDefaultRoles(auth.token),
        enabled: !!auth.token && auth.token !== "demo-token-12345",
    });

    const handleGetCycle = async (cicle) => {
        try {
            const response = await getCycle(cicle, auth.token);
            setData(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }
    };

    // ── Guardar ciclo completo ──────────────────────────────────────────────
    const saveCycleMutation = useMutation({
        mutationFn: ({ data: dataToUse, ciclo: cicloToUse }) => {
            const dataToSave = generateShiftData(dataToUse, cicloToUse);
            return axiosClient.post('/gs/saveAll', dataToSave);
        },
    });

    const handleSaveCycle = (externalData, externalCiclo, callbacks = {}) => {
        return saveCycleMutation.mutateAsync(
            { data: externalData ?? data, ciclo: externalCiclo ?? ciclo },
            callbacks  // { onSuccess, onError } por llamada
        );
    };

    // ── Guardar solo cambios modificados ───────────────────────────────────
    const saveModifiedCycleMutation = useMutation({
        mutationFn: ({ modifiedData, ciclo: cicloToUse }) => {
            const dataToSave = generateModifiedShiftData(modifiedData, cicloToUse);
            return axiosClient.post('/gs/saveAll', dataToSave);
        },
    });

    const handleSaveModifiedCycle = (externalModifiedData, externalCiclo, callbacks = {}) => {
        return saveModifiedCycleMutation.mutateAsync(
            { modifiedData: externalModifiedData, ciclo: externalCiclo ?? ciclo },
            callbacks
        );
    };

    // ── Crear por genérico ─────────────────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (config) => createByGenericShift(config, auth.token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roster"] });
        },
        onError: (error) => console.error("Error al crear por genérico:", error),
    });

    const handleCreateByGeneric = (config, callbacks = {}) => {
        return createMutation.mutateAsync(config, callbacks);
    };

    // ── Toggle activo/inactivo con optimistic update ───────────────────────
    const toggleMutation = useMutation({
        mutationFn: (id) => toggleShiftRole(id, auth.token),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["roles", auth.token] });
            const previous = queryClient.getQueryData(["roles", auth.token]);
            queryClient.setQueryData(["roles", auth.token], (old) =>
                old?.map(r => r.id === id ? { ...r, active: !r.active } : r)
            );
            return { previous };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["roles", auth.token], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", auth.token] });
        },
    });

    const handleToggle = (id) => toggleMutation.mutate(id);

    // ── Eliminar rol con optimistic update ────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteRole(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["roles", auth.token] });
            const previous = queryClient.getQueryData(["roles", auth.token]);
            queryClient.setQueryData(["roles", auth.token], (old) =>
                old?.filter(r => r.id !== id)
            );
            return { previous };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["roles", auth.token], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["roles", auth.token] });
        },
    });

    const handleDeleteRole = (id) => deleteMutation.mutate(id);

    // ── Refetch helpers ───────────────────────────────────────────────────
    const handleGetAllRoles = () => refetchRoles();
    const handleGetRolesByDefault = () => refetchDefaults();
    const handleGetAllRolesWihtDefaults = () => Promise.all([refetchRoles(), refetchDefaults()]);

    return {
        data,
        ciclo,
        roles,
        defaultRoles,
        isSavingCycle: saveCycleMutation.isPending,
        isSavingModified: saveModifiedCycleMutation.isPending,
        handleToggle,
        setCiclo,
        setData,
        handleSaveCycle,
        handleSaveModifiedCycle,
        handleGetCycle,
        handleGetAllRoles,
        handleGetRolesByDefault,
        handleCreateByGeneric,
        handleGetAllRolesWihtDefaults,
        handleDeleteRole,
    };
};