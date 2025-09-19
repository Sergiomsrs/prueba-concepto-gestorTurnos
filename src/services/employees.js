const API_URL = import.meta.env.VITE_API_URL;

export const searchActiveEmployees = async () => {
    try {
        const response = await fetch(`${API_URL}/emp/active`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        const employees = await response.json();
        return employees; // Devuelve el array de empleados
    } catch (error) {
        console.error('Error al buscar empleados activos:', error);
        throw error; // Permite manejar el error en el componente que llama
    }
};

export const searchSchedulesByEmployesAndDate = async () => {
    try {
        const response = await fetch(`${API_URL}/schedule/employee/1/schedules?startDate=2025-08-01&endDate=2025-08-31`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        const employees = await response.json();
        return employees; // Devuelve el array de empleados
    } catch (error) {
        console.error('Error al buscar empleados activos:', error);
        throw error; // Permite manejar el error en el componente que llama
    }
};

export const searchPtoByEmployee = async (employeeId) => {
    try {
        const response = await fetch(`${API_URL}/pto/${employeeId}`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        const ptoList = await response.json();
        return ptoList; // Devuelve el array de ausencias (PTO)
    } catch (error) {
        console.error('Error al buscar ausencias del empleado:', error);
        throw error;
    }
};

export const fetchAbsences = (selectedId) => {
    return fetch(`${API_URL}/disp/${selectedId}`)
        .then(response => {
            if (response.status === 204) {
                // No hay contenido
                return { status: 204, data: null };
            }
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }
            return response.json().then(data => ({ status: response.status, data }));
        });
};


/* Nueva implementacion servicios + hooks */

export const getAllEmployees = async () => {
    try {
        const response = await fetch(`${API_URL}/emp/findall`, {
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

export const fetchDisponibilities = {
    getDisponibilities: async (selectedId) => {
        const res = await fetch(`${API_URL}/disp/${selectedId}`);
        if (res.status === 204) {
            return { status: 204, data: null };
        }
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
    saveDisponibility: async (disponibilityData) => {
        const res = await fetch(`${API_URL}/disp/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(disponibilityData),
        });
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        // El backend responde con JSON (la entidad Disponibility)
        const data = await res.json();
        return { status: res.status, data };
    },
    deleteDisponibilityById: async (id) => {
        const res = await fetch(`${API_URL}/disp/delete/${id}`, {
            method: "DELETE",
        });
        if (res.status === 204) {
            return { status: 204, data: null };
        }
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },

};


export const fetchPto = {
    getPtoList: async (selectedId) => {
        const res = await fetch(`${API_URL}/pto/${selectedId}`);
        if (res.status === 204) {
            return { status: 204, data: null };
        }
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
    savePto: async (PtoData) => {
        const res = await fetch(`${API_URL}/pto/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(PtoData),
        });
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
    deletePtoById: async (ptoId) => {
        const res = await fetch(`${API_URL}/pto/delete/${ptoId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error(`Error en la respuesta del servidor: ${res.status}`);
        }
        const data = await res.json();
        return { status: res.status, data };
    },
};