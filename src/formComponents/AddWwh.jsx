import { useEffect, useState } from "react"
import { Selector } from "./Selector";

export const AddWwh = () => {

    const initialState = { name: '', lastName: '', email: '', hireDate: '', terminationDate: '' };
    const [createForm, setCreateForm] = useState(initialState);
    const [email, setEmail] = useState("");
    const [isExistingEmployee, setIsExistingEmployee] = useState(false);
    const [message, setMessage] = useState("");
    const [employees, setEmployees] = useState([]); // Estado para la lista de empleados

    // Cargar todos los empleados cuando el componente se monta
    useEffect(() => {
        fetch('http://localhost:8081/api/emp/findall') // URL para obtener todos los empleados
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error("Error al cargar empleados:", error));
    }, []);



    

    

    
    const handleSave = () => {
        fetch('http://localhost:8081/api/emp/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createForm),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    };
    
    const handleUpdate = () => {
        fetch(`http://localhost:8081/api/emp/update/${createForm.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createForm),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    };
    
    const handleDelete = () => {
        fetch(`http://localhost:8081/api/emp/delete/${createForm.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('Usuario eliminado exitosamente');
                setMessage("Usuario eliminado exitosamente");
                setCreateForm(initialState); // Reiniciar el formulario
                setIsExistingEmployee(false);
            } else {
                console.error('Error al eliminar el usuario');
                setMessage("Error al eliminar el usuario");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessage("Error al eliminar el usuario");
        });
    };
    
    
    const handleEmployeeSelect = (e) => {
        const selectedId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.id.toString() === selectedId);
        if (selectedEmployee) {
            
            setCreateForm(selectedEmployee);
            setIsExistingEmployee(true);
            setMessage("");
        } else {
            setCreateForm(initialState);
            setIsExistingEmployee(false);
        }
    };
    
    const handleCancel = () => {
        setCreateForm(initialState);
        setIsExistingEmployee(false);
    };
    console.log(createForm);
    
    return (
        <form>
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-row gap-4 mb-2">
                <div className="w-3/4">
                    <label htmlFor="employee-select" className="block text-sm font-medium leading-6 mb-2 text-gray-900">Seleccionar Empleado</label>
                    <select
                        id="employee-select"
                        onChange={handleEmployeeSelect}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                        <option value="">-- Seleccione un empleado --</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} {employee.lastName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            
        </form>
    );
}