import { useState, useCallback } from "react";
import { apiMockData } from "../../utils/apiMock";
import { fetchRosterBetweenDates, saveRosterData } from "../services/rosterService";

const API_URL = import.meta.env.VITE_API_URL;

export const useRoster = () => {
    const [apiData, setApiData] = useState(apiMockData);
    const [alert, setAlert] = useState({ isOpen: false, message: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRosterBetweenDates = useCallback(async (startDate, endDate) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchRosterBetweenDates(startDate, endDate);

            if (result.success) {
                setApiData(result.data);
                setAlert({
                    isOpen: true,
                    message: { type: "success", text: result.message },
                });
            } else {
                setError(result.error);
                setAlert({
                    isOpen: true,
                    message: { type: "error", text: result.message },
                });
            }
        } catch (err) {
            setError(err.message);
            setAlert({
                isOpen: true,
                message: { type: "error", text: "Error inesperado al cargar los datos" },
            });
        } finally {
            setLoading(false);
            setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
        }
    }, []);

    const saveData = useCallback(async (modifiedData) => {
        // Validación de entrada
        if (!modifiedData || !Array.isArray(modifiedData) || modifiedData.length === 0) {
            setAlert({
                isOpen: true,
                message: { type: "warning", text: "No hay datos para guardar" },
            });
            return { success: false, message: "No hay datos para guardar" };
        }

        setLoading(true);
        setError(null);

        try {
            const result = await saveRosterData(modifiedData);

            if (result.success) {
                setAlert({
                    isOpen: true,
                    message: { type: "success", text: result.message },
                });

                return { success: true, data: result.data };
            } else {
                setError(result.error);
                setAlert({
                    isOpen: true,
                    message: { type: "error", text: result.message },
                });

                return { success: false, message: result.message };
            }
        } catch (err) {
            const errorMessage = "Error inesperado al guardar los datos";
            setError(err.message);
            setAlert({
                isOpen: true,
                message: { type: "error", text: errorMessage },
            });

            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
            setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
        }
    }, []);

    const clearAlert = useCallback(() => {
        setAlert({ isOpen: false, message: null });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        apiData,
        alert,
        loading,
        error,
        getRosterBetweenDates,
        saveData,
        clearAlert,
        clearError
    };
};
