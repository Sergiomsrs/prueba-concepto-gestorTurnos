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

    /* ----- Weekly Work Hours Methods ----- */

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


    /* ----- Team Work Methods ----- */

    const handleGetTwByEmployeeId = async (employeeId) => {
        try {
            const result = await fetchTwConditions.getTeamWorkByEmployee(employeeId);
            if (result.length === 0) {
                setMessage("No hay registros para este empleado")
            }
            setCurrentEmployeeId(employeeId)
            setTeamWork(result);

        } catch (error) {
            setMessage("No se encuentran equipos de trabajo asignados al empleado.");
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
            handleGetTwByEmployeeId(employeeId)
        } catch (error) {
            setMessage("Error al guardar el equipo de trabajo.");
            setTeamWork([])
            throw error;
        }
    }

    const handleDeleteTw = async (twId) => {

        try {
            await fetchTwConditions.deleteTw(twId);
            setMessage("Equipo eliminado correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            setNewTeamWork({ teamWork: "", twStartDate: "" });
            handleGetTwByEmployeeId(currentEmployeeId)
        } catch (error) {
            setMessage("Error al eliminar el equipo de trabajo.");
            setNewTeamWork([])
            throw error;
        }
    }


    return {
        message,
        currentEmployeeId,

        workHours,
        newWorkHours,
        teamWork,
        newTeamWork,

        setMessage,
        setWorkHours,
        setNewWorkHours,
        setTeamWork,
        setNewTeamWork,

        handleSaveWwh,
        handleDeleteWwh,
        handleGetWwhByEmployeeId,
        handleDeleteTw,
        handleSaveTw,
        handleGetTwByEmployeeId

    }
}