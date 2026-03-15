import { axiosClient } from "@/services/axiosClient";


// ✅ fetchRosterBetweenDates migrado a Axios
export const fetchRosterBetweenDates = async (startDate, endDate) => {
    try {
        const response = await axiosClient.get(`/day/${startDate}/${endDate}`);

        return {
            success: true,
            data: response.data,
            message: "Datos cargados correctamente"
        };
    } catch (error) {
        console.error('Error en fetchRosterBetweenDates:', error);

        // Axios guarda el error de respuesta en error.response
        const errorMessage = error.response?.data?.message || error.message || "Error al cargar los datos";

        return {
            success: false,
            data: null,
            message: errorMessage,
            error: error
        };
    }
};

// ✅ saveRosterData migrado a Axios
export const saveRosterData = async (modifiedData) => {
    // Validación de entrada (se mantiene igual)
    if (!modifiedData || !Array.isArray(modifiedData)) {
        return {
            success: false,
            data: null,
            message: "Los datos a guardar no son válidos",
            error: "Invalid data format"
        };
    }

    if (modifiedData.length === 0) {
        return {
            success: false,
            data: null,
            message: "No hay datos para guardar",
            error: "Empty data array"
        };
    }

    try {
        const response = await axiosClient.post('/ws/saveAll', modifiedData);

        return {
            success: true,
            data: response.data,
            message: response.data?.message || "Datos guardados correctamente"
        };

    } catch (error) {
        console.error('Error en saveRosterData:', error);

        let userMessage = "Error al guardar los datos";

        // Manejo de errores específico de Axios
        if (error.code === 'ERR_NETWORK') {
            userMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else if (error.response?.data?.message) {
            userMessage = error.response.data.message;
        } else if (error.message) {
            userMessage = error.message;
        }

        return {
            success: false,
            data: null,
            message: userMessage,
            error: error.message || "Unknown error"
        };
    }
};

// ✅ updateSingleShift migrado a Axios
export const updateSingleShift = async (employeeId, date, shiftData) => {
    if (!employeeId || !date || !shiftData) {
        return {
            success: false,
            data: null,
            message: "Faltan parámetros requeridos",
            error: "Missing required parameters"
        };
    }

    try {
        const response = await axiosClient.put('/ws/updateShift', {
            employeeId,
            date,
            ...shiftData
        });

        return {
            success: true,
            data: response.data,
            message: "Turno actualizado correctamente"
        };

    } catch (error) {
        console.error('Error en updateSingleShift:', error);

        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Error al actualizar el turno",
            error: error.message || "Unknown error"
        };
    }
};