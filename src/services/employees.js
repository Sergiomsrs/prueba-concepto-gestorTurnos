

const API_URL = import.meta.env.VITE_API_URL;

export const searchActiveEmployees = async () => {
    try {
        const response = await fetch('http://localhost:8081/api/emp/active');
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

/*
Ejemplo de uso
  useEffect(() => {
    searchActiveEmployees()
      .then(data => setEmployees(data))
      .catch(error => setError(error.message));
}, []); */


export const searchSchedulesByEmployesAndDate = async () => {
    try {
        const response = await fetch('http://localhost:8081/api/schedule/employee/1/schedules?startDate=2025-08-01&endDate=2025-08-31');
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
        const response = await fetch(`http://localhost:8081/api/pto/${employeeId}`);
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
    return fetch(`http://localhost:8081/api/disp/${selectedId}`)
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

export const getEmployeesData = {
    getDisponibilities: async () => {
        const res = await fetch(`${API_URL}/disp/${selectedId}`);
        return res.json();
    }
}