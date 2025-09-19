const API_URL = import.meta.env.VITE_API_URL;

export const getShiftWeek = async (startDate, endDate) => {
    try {
        const response = await fetch(`${API_URL}/day/${startDate}/${endDate}`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Devuelve los datos al componente
    } catch (error) {
        throw error; // El componente decide cómo manejar el error
    }
};

export const getGenericShiftWeek = async () => {

    try {
        const response = await fetch(`${API_URL}/gs/getRoles`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Devuelve los datos al componente
    } catch (error) {
        throw error; // El componente decide cómo manejar el error
    }

}

export const fetchShift = {
    saveIndividualShift: async (config) => {
        const res = await fetch(`${API_URL}/schedule/create-turn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
};