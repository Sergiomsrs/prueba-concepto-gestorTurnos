const API_URL = import.meta.env.VITE_API_URL;


export const fetchTwConditions = {

    getTeamWorkByEmployee: async (employeeId) => {


        try {
            const response = await fetch(`${API_URL}/teamwork/${employeeId}`, {
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
    saveTw: async (employeeId, startDate, endDate) => {
        const res = await fetch(`${API_URL}/teamwork/create?employeeId=${employeeId}&teamWork=${startDate}&twStartDate=${endDate}`, {
            method: "POST",
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
    deleteTw: async (twId) => {
        const res = await fetch(`${API_URL}/teamwork/${twId}`, {
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