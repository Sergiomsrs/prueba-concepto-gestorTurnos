const API_URL = import.meta.env.VITE_API_URL;


export const fetchPublicHolidays = {

    getAll: async () => {


        try {
            const response = await fetch(`${API_URL}/ph`, {
                method: "GET",
            });

            if (response.status === 204) {
                return [];
            }
            if (!response.ok) {
                console.log(response)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    savePh: async (id, date, type, description, paid) => {
        const res = await fetch(`${API_URL}/ph`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                date: date,
                type: type,
                description: description,
                paid: paid == "SI" ? true : false
            })
        });
        console.log({
            id: id,
            date: date,
            type: type,
            description: description,
            paid: paid == "SI" ? true : false
        })
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
    deleteById: async (id) => {
        const res = await fetch(`${API_URL}/ph/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
};