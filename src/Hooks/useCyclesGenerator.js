import { useContext, useEffect, useState } from "react";
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

    const {
        data: roles = rolesMock,
        refetch: refetchRoles
    } = useQuery({
        queryKey: ["roles", auth.token],
        queryFn: () => getRoles(auth.token),
        enabled: !!auth.token && auth.token !== "demo-token-12345",
        initialData: auth.token === "demo-token-12345" ? rolesMock : undefined,
    });

    const {
        data: defaultRoles = [],
        refetch: refetchDefaults
    } = useQuery({
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

    const saveCycleMutation = useMutation({
        mutationFn: async ({ data: dataToUse, ciclo: cicloToUse }) => {
            const dataToSave = generateShiftData(dataToUse, cicloToUse);
            return axiosClient.post('/gs/saveAll', dataToSave);
        },
        onSuccess: (response) => {
            if (response.data.status === "success") {
                console.log("✅ Vamos Bien");
            }
        },
        onError: (error) => {
            console.log("❌ Vamos Mal");
            console.error(error);
        }
    });

    const handleSaveCycle = (externalData, externalCiclo) => {
        return saveCycleMutation.mutateAsync({
            data: externalData ?? data,
            ciclo: externalCiclo ?? ciclo
        });
    };

    // ✅ NUEVO: Mutación para guardar solo cambios modificados
    const saveModifiedCycleMutation = useMutation({
        mutationFn: async ({ modifiedData: modifiedDataToUse, ciclo: cicloToUse }) => {
            const dataToSave = generateModifiedShiftData(modifiedDataToUse, cicloToUse);
            return axiosClient.post('/gs/saveAll', dataToSave);
        },
        onSuccess: (response) => {
            if (response.data.status === "success") {
                console.log("✅ Cambios guardados exitosamente");
            }
        },
        onError: (error) => {
            console.log("❌ Error al guardar cambios");
            console.error(error);
        }
    });

    const handleSaveModifiedCycle = (externalModifiedData, externalCiclo) => {
        return saveModifiedCycleMutation.mutateAsync({
            modifiedData: externalModifiedData,
            ciclo: externalCiclo ?? ciclo
        });
    };

    const createMutation = useMutation({
        mutationFn: (config) => createByGenericShift(config, auth.token),
        onError: (error) => console.error(error)
    });

    const handleCreateByGeneric = (config) => {
        createMutation.mutate(config);
    };

    const toggleMutation = useMutation({
        mutationFn: (id) => toggleShiftRole(id, auth.token),

        onMutate: async (id) => {
            await queryClient.cancelQueries(["roles", auth.token]);

            const previous = queryClient.getQueryData(["roles", auth.token]);

            queryClient.setQueryData(["roles", auth.token], (old) =>
                old?.map(r =>
                    r.id === id ? { ...r, active: !r.active } : r
                )
            );

            return { previous };
        },

        onError: (err, id, context) => {
            queryClient.setQueryData(["roles", auth.token], context.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries(["roles", auth.token]);
        }
    });

    const handleToggle = (id) => {
        toggleMutation.mutate(id);
    };

    const handleGetAllRoles = async () => {
        await refetchRoles();
    };

    const handleGetRolesByDefault = async () => {
        await refetchDefaults();
    };

    const handleGetAllRolesWihtDefaults = async () => {
        await Promise.all([refetchRoles(), refetchDefaults()]);
    };

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteRole(id),
        onMutate: async (id) => {
            // Optimistic update — quita el rol de la lista inmediatamente
            await queryClient.cancelQueries(["roles", auth.token]);
            const previous = queryClient.getQueryData(["roles", auth.token]);
            queryClient.setQueryData(["roles", auth.token], (old) =>
                old?.filter(r => r.id !== id)
            );
            return { previous };
        },
        onError: (err, id, context) => {
            // Si falla, revertir
            queryClient.setQueryData(["roles", auth.token], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["roles", auth.token]);
        }
    });

    const handleDeleteRole = (id) => {
        deleteMutation.mutate(id);
    };

    return {
        data,
        ciclo,
        roles,
        defaultRoles,
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
        handleDeleteRole
    };
};