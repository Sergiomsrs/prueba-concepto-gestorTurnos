const API_URL = import.meta.env.VITE_API_URL;

export const getCycle = async (cycle, token) => {
    try {
        const response = await fetch(`${API_URL}/gs/getcycle?cycle=${cycle}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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


export const getRoles = async (token) => {
    try {
        const response = await fetch(`${API_URL}/role`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const getDefaultRoles = async (token) => {
    try {
        const response = await fetch(`${API_URL}/default/get-all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export const createByGenericShift = async (config, token) => {
    try {
        const response = await fetch(`${API_URL}/gs/create-week`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const toggleShiftRole = async (roleId, token) => {
    try {
        const response = await fetch(`${API_URL}/role/${roleId}/toggle-active`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedRole = await response.json();
        return updatedRole;
    } catch (error) {
        throw error;
    }
};

export const saveDefaultRole = async (role, token) => {
    try {
        const response = await fetch(`${API_URL}/default/save`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(role),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
