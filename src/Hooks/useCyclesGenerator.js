import { useEffect, useState } from "react";
import { employess, generateData, generateShiftData } from "../utils/shiftGeneratorData";
import { getGenericShiftWeek } from "../services/shiftService";
import { createByGenericShift, getCycle, getDefaultRoles, getRoles, toggleShiftRole } from "../services/genericShiftService";
import { rolesMock } from "@/utils/apiMock";

const API_URL = import.meta.env.VITE_API_URL;

export const useCyclesGenerator = () => {

    const [data, setData] = useState([])
    const [ciclo, setCiclo] = useState("");
    const [roles, setRoles] = useState(rolesMock)
    const [defaultRoles, setDefaultRoles] = useState([])

    useEffect(() => {

        setData(generateData(1, employess))

    }, []);

    const handleGetCycle = async (cicle) => {
        try {
            const response = await getCycle(cicle); // llamada al fetch
            setData(response); // guarda en estado
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }
    };



    const handleSaveCycle = () => {
        const dataToSave = generateShiftData(data, ciclo)
        console.log(dataToSave)

        fetch(`${API_URL}/gs/saveAll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta completa del backend:", data);
                if (data.status === "success") {
                    console.log("Vamos Bien")
                }

            })
            .catch(error => {
                console.log("Vamos Mal")
            });
    };

    const handleGetAllRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }
    const handleGetAllRolesWihtDefaults = async () => {
        try {
            const response = await getRoles();
            setRoles(response);

            const response2 = await getDefaultRoles();
            setDefaultRoles(response2)
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleGetRolesByDefault = async () => {
        try {
            const response = await getDefaultRoles();
            setDefaultRoles(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleCreateByGeneric = async (config) => {

        const response = await createByGenericShift(config);
        return response;
    }

    const handleToggle = async (id) => {
        try {
            await toggleShiftRole(id); // Ejecuta el toggle
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