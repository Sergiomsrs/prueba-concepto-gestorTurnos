import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchConditions } from "../services/wwhService";
import { fetchTwConditions } from "../services/teamWorkService";

export const useEmployeeConditions = (employeeId) => {
    const queryClient = useQueryClient();
    const [newWorkHours, setNewWorkHours] = useState({ weeklyWorkHoursData: "", wwhStartDate: "" });
    const [newTeamWork, setNewTeamWork] = useState({ teamWork: "", twStartDate: "" });
    const [message, setMessage] = useState("");

    /* ----- Weekly Work Hours Queries ----- */
    const saveWwhMutation = useMutation({
        mutationFn: ({ employeeId: empId, weeklyWorkHoursData, wwhStartDate }) =>
            fetchConditions.saveWwh(empId, weeklyWorkHoursData, wwhStartDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wwh", employeeId] });
            setMessage("Jornada guardada correctamente.");
            setNewWorkHours({ weeklyWorkHoursData: "", wwhStartDate: "" });
            setTimeout(() => setMessage(""), 2000);
        },
        onError: () => setMessage("Error al guardar la jornada."),
    });

    const deleteWwhMutation = useMutation({
        mutationFn: (wwhId) => fetchConditions.deleteWwh(wwhId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wwh", employeeId] });
            setMessage("Jornada eliminada correctamente.");
            setTimeout(() => setMessage(""), 2000);
        },
        onError: () => setMessage("Error al eliminar la jornada."),
    });

    const saveTwMutation = useMutation({
        mutationFn: ({ employeeId: empId, teamWork, twStartDate }) =>
            fetchTwConditions.saveTw(empId, teamWork, twStartDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamwork", employeeId] });
            setMessage("Equipo guardado correctamente.");
            setNewTeamWork({ teamWork: '', twStartDate: '' });
            setTimeout(() => setMessage(""), 2000);
        },
        onError: () => setMessage("Error al guardar el equipo."),
    });

    const deleteTwMutation = useMutation({
        mutationFn: (twId) => fetchTwConditions.deleteTw(twId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teamwork", employeeId] });
            setMessage("Equipo eliminado correctamente.");
            setTimeout(() => setMessage(""), 2000);
        },
        onError: () => setMessage("Error al eliminar el equipo."),
    });

    /* ----- Handlers ----- */
    const handleSaveWwh = (employeeId, weeklyWorkHoursData, wwhStartDate) => {
        saveWwhMutation.mutate({ employeeId, weeklyWorkHoursData, wwhStartDate });
    };

    const handleDeleteWwh = (wwhId) => {
        deleteWwhMutation.mutate(wwhId);
    };

    const handleSaveTw = (employeeId, teamWorkData) => {
        saveTwMutation.mutate({ employeeId, ...teamWorkData });
    };

    const handleDeleteTw = (twId) => {
        deleteTwMutation.mutate(twId);
    };


    return {
        message,
        newWorkHours,
        newTeamWork,

        setMessage,
        setNewWorkHours,
        setNewTeamWork,

        handleSaveWwh,
        handleDeleteWwh,
        handleSaveTw,
        handleDeleteTw,
    };
};