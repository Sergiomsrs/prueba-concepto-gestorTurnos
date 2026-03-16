import { useContext, useEffect, useState } from "react";
import { employess, generateData, generateShiftData } from "../utils/shiftGeneratorData";
import { createByGenericShift, getCycle, getDefaultRoles, getRoles, toggleShiftRole } from "../services/genericShiftService";
import { rolesMock } from "@/utils/apiMock";
import { AuthContext } from "@/timeTrack/context/AuthContext";
import { axiosClient } from "@/services/axiosClient";


export const useCyclesGenerator = () => {

    const [data, setData] = useState([])
    const [ciclo, setCiclo] = useState("");
    const [roles, setRoles] = useState(rolesMock)
    const [defaultRoles, setDefaultRoles] = useState([])

    const { auth } = useContext(AuthContext);

    useEffect(() => {

        setData(generateData(1, employess))

    }, []);

    const handleGetCycle = async (cicle) => {
        try {
            const response = await getCycle(cicle, auth.token); // llamada al fetch
            setData(response); // guarda en estado
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }
    };



    const handleSaveCycle = async () => {
        const dataToSave = generateShiftData(data, ciclo);

        try {
            // Axios se encarga del JSON.stringify y del Content-Type automáticamente
            const response = await axiosClient.post('/gs/saveAll', dataToSave);

            // La respuesta del servidor está en response.data
            if (response.data.status === "success") {
                console.log("Vamos Bien");
            }
        } catch (error) {
            // Cualquier error (4xx, 5xx o red) caerá aquí
            console.log("Vamos Mal");
            console.error("Detalles del error:", error);
        }
    };

    const handleGetAllRoles = async () => {
        try {
            const response = await getRoles(auth.token);
            setRoles(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }
    const handleGetAllRolesWihtDefaults = async () => {
        try {
            const response = await getRoles(auth.token);
            setRoles(response);

            const response2 = await getDefaultRoles(auth.token);
            setDefaultRoles(response2)
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleGetRolesByDefault = async () => {
        try {
            const response = await getDefaultRoles(auth.token);
            setDefaultRoles(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleCreateByGeneric = async (config) => {
        try {
            const response = await createByGenericShift(config, auth.token);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleToggle = async (id) => {
        try {
            await toggleShiftRole(id, auth.token); // Ejecuta el toggle
            console.log("Rol actualizado:", id);

            // Vuelve a cargar los roles
            await handleGetAllRolesWihtDefaults();
        } catch (err) {
            console.error("Error al actualizar el rol:", err);
        }
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
        handleGetCycle,
        handleGetAllRoles,
        handleGetRolesByDefault,
        handleCreateByGeneric,
        handleGetAllRolesWihtDefaults
    }

}