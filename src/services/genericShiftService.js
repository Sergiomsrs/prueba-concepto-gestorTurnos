
const API_URL = import.meta.env.VITE_API_URL;

export const getCycle = async (cycle) => {
    try {
        const response = await fetch(`${API_URL}/gs/getcycle?cycle=${cycle}`, {
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


export const getRoles = async () => {
    try {
        const response = await fetch(`${API_URL}/role`, {
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