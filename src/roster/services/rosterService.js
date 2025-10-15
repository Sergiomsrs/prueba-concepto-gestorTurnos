const API_URL = import.meta.env.VITE_API_URL;

export const fetchRosterBetweenDates = async (startDate, endDate) => {
    try {
        const response = await fetch(`${API_URL}/day/${startDate}/${endDate}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            data,
            message: "Datos cargados correctamente"
        };
    } catch (error) {
        console.error('Error en fetchRosterBetweenDates:', error);
        return {
            success: false,
            data: null,
            message: error.message || "Error al cargar los datos",
            error: error
        };
    }
};

// ✅ Método saveData mejorado
export const saveRosterData = async (modifiedData) => {
    // Validación de entrada
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
        const response = await fetch(`${API_URL}/ws/saveAll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(modifiedData),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            let errorMessage = `Error del servidor: ${response.status}`;

            // Intentar obtener mensaje de error del servidor
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Si no se puede parsear JSON, usar mensaje genérico
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        // Intentar parsear la respuesta
        let responseData;
        try {
            responseData = await response.json();
        } catch {
            // Si no hay JSON en la respuesta, asumir éxito
            responseData = { message: "Datos guardados correctamente" };
        }

        return {
            success: true,
            data: responseData,
            message: responseData.message || "Datos guardados correctamente"
        };

    } catch (error) {
        console.error('Error en saveRosterData:', error);

        // Manejar diferentes tipos de errores
        let userMessage = "Error al guardar los datos";

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            userMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else if (error.message.includes('JSON')) {
            userMessage = "Error al procesar la respuesta del servidor.";
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

// ✅ Método adicional para actualizar un shift específico
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
        const response = await fetch(`${API_URL}/ws/updateShift`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                employeeId,
                date,
                ...shiftData
            }),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const responseData = await response.json();

        return {
            success: true,
            data: responseData,
            message: "Turno actualizado correctamente"
        };

    } catch (error) {
        console.error('Error en updateSingleShift:', error);

        return {
            success: false,
            data: null,
            message: "Error al actualizar el turno",
            error: error.message || "Unknown error"
        };
    }
};