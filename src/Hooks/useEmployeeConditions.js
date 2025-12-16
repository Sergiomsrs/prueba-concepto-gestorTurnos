import { useState } from "react";
import { fetchConditions } from "../services/wwhService";



export const useEmployeeConditions = () => {

    const [workHours, setWorkHours] = useState([]);
    const [message, setMessage] = useState("");
    const [newWorkHours, setNewWorkHours] = useState({ weeklyWorkHoursData: "", wwhStartDate: "" }); // Estado para la nueva jornada



    const handleGetWwhByEmployeeId = async (employeeId) => {
        try {
            const result = await fetchConditions.getWwhByEmployee(employeeId);
            if (result.length === 0) {
                setMessage("No hay registros para este empleado")
            }
            setWorkHours(result);

        } catch (error) {
            setMessage("No se encuentran Jornadas asignadas al empleado.");
            console.error(error);
            throw error;
        }
    }

    const handleSaveWwh = async (employeeId, startDate, endDate) => {

        setWorkHours([]);
        setMessage("");

        try {
            await fetchConditions.saveWwh(employeeId, startDate, endDate);
            setMessage("Jornada guardada correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            setNewWorkHours({ weeklyWorkHoursData: "", wwhStartDate: "" });
            handleGetWwhByEmployeeId(employeeId)
        } catch (error) {
            setMessage("Error al guardar la jornada.");
            setWorkHours([])
            throw error;
        }


    }


    return {
        workHours,
        setWorkHours,
        newWorkHours,
        setNewWorkHours,
        message,
        setMessage,
        handleGetWwhByEmployeeId,
        handleSaveWwh

    }
}