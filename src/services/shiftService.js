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
        return data;
    } catch (error) {
        throw error;
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
        return data;
    } catch (error) {
        throw error;
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
    copyWeek: async ({ sourceStartDate, targetStartDate }) => {
        const res = await fetch(`${API_URL}/schedule/copy-week`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sourceStartDate, targetStartDate }),
        });
        if (!res.ok) {
            throw new Error("Error al copiar semana");
        }
        const text = await res.text();
        return { status: res.status, data: text };
    },
};