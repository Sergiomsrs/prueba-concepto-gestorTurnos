import { useState } from "react";
import { fetchConditions } from "../services/wwhService";
import { fetchTwConditions } from "../services/teamWorkService";



export const useEmployeeConditions = () => {

    const [workHours, setWorkHours] = useState([]);
    const [newWorkHours, setNewWorkHours] = useState({ weeklyWorkHoursData: "", wwhStartDate: "" });

    const [teamWork, setTeamWork] = useState([]);
    const [newTeamWork, setNewTeamWork] = useState({ teamWork: "", twStartDate: "" });
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);


    const [message, setMessage] = useState("");

    const handleGetWwhByEmployeeId = async (employeeId) => {
        try {
            const result = await fetchConditions.getWwhByEmployee(employeeId);
            if (result.length === 0) {
                setMessage("No hay registros para este empleado")
            }
            setCurrentEmployeeId(employeeId)
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

    const handleDeleteWwh = async (wwhId) => {

        try {
            await fetchConditions.deleteWwh(wwhId);
            setMessage("Jornada eliminada correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            setNewWorkHours({ weeklyWorkHoursData: "", wwhStartDate: "" });
            handleGetWwhByEmployeeId(currentEmployeeId)
        } catch (error) {
            setMessage("Error al eliminar la jornada.");
            setWorkHours([])
            throw error;
        }
    }

    const handleGetTwByEmployeeId = async (employeeId) => {
        try {
            const result = await fetchTwConditions.getTeamWorkByEmployee(employeeId);
            if (result.length === 0) {
                setMessage("No hay registros para este empleado")
            }
            setTeamWork(result);

        } catch (error) {
            setMessage("No se encuentran Jornadas asignadas al empleado.");
            console.error(error);
            throw error;
        }
    }

    const handleSaveTw = async (employeeId, startDate, endDate) => {

        setTeamWork([]);
        setMessage("");

        try {
            await fetchTwConditions.saveTw(employeeId, startDate, endDate);
            setMessage("Nuevo equipo de trabajo guardado correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            setNewTeamWork({ teamWork: "", twStartDate: "" });
            handleGetTwByEmployeeId(currentEmployeeId)
        } catch (error) {
            setMessage("Error al guardar el equipo de trabajo.");
            setTeamWork([])
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
        handleSaveWwh, teamWork, setteamWork: setTeamWork, newTeamWork, setNewTeamWork, handleGetTwByEmployeeId, handleSaveTw, handleDeleteWwh, currentEmployeeId

    }
}