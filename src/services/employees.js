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