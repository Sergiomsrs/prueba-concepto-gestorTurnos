import { useState } from "react";
import { fetchShift } from "../services/shiftService";
import { apiMockData } from "../utils/apiMock";

export const useShift = () => {
    const [shift, setShift] = useState();
    const [shiftMessage, setShiftMessage] = useState("");

    const handleSaveIndividualShift = async (shiftData) => {
        try {
            const result = await fetchShift.saveIndividualShift(shiftData);
            setShiftMessage("Turno guardado correctamente.");
            return result;
        } catch (error) {
            setShiftMessage("Error al guardar el turno.");
            console.error(error);
            throw error;
        }
    };

    const handleCopyWeek = async ({ sourceStartDate, targetStartDate }) => {
        try {
            const result = await fetchShift.copyWeek({ sourceStartDate, targetStartDate });
            setShiftMessage("Semana copiada correctamente");
            return result;
        } catch (error) {
            setShiftMessage(error.message || "Error al copiar semana");
            throw error;
        }
    };

    return {
        handleSaveIndividualShift,
        shiftMessage,
        handleCopyWeek,
    };
};