import { useState } from "react";
import { axiosClient } from "@/services/axiosClient";

const initialState = {
    id: "",
    name: "",
    lastName: "",
    email: "",
    hireDate: "",
    terminationDate: "",
    secondLastName: "",
    dni: "",
    password: "",
    role: "",
};

export const AddUSer = ({ allEmployees: employees }) => {
    const [createForm, setCreateForm] = useState(initialState);
    const [email, setEmail] = useState("");
    const [isExistingEmployee, setIsExistingEmployee] = useState(false);
    const [message, setMessage] = useState("");

    const handleInputCreateChange = (e) => {
        setCreateForm({
            ...createForm,
            [e.target.name]: e.target.value
        });
    };

    const handleInputEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await axiosClient.post('/emp/create', createForm);
            console.log('Success:', response.data);
            setMessage("Usuario creado con éxito");
        } catch (error) {
            console.error('Error:', error);
            setMessage("Error al crear usuario");
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await axiosClient.put(`/emp/update/${createForm.id}`, createForm);
            console.log('Success:', response.data);
            setMessage("Usuario actualizado con éxito");
        } catch (error) {
            console.error('Error:', error);
            setMessage("Error al actualizar usuario");
        }
    };

    const handleDelete = async (e) => {
        if (e) e.preventDefault();
        try {
            await axiosClient.delete(`/emp/delete/${createForm.id}`);
            console.log('Usuario eliminado exitosamente');
            setMessage("Usuario eliminado exitosamente");
            setCreateForm(initialState);
            setIsExistingEmployee(false);
        } catch (error) {
            console.error('Error:', error);
            setMessage("Error al eliminar el usuario");
        }
    };

    const handleSearch = async () => {
        try {
            // Pasamos el email como parámetro de consulta (query param)
            const response = await axiosClient.get('/emp/search', {
                params: { email }
            });

            setCreateForm(response.data);
            setIsExistingEmployee(true);
            setMessage("");
        } catch (error) {
            console.error("Error buscando el empleado", error);
            setIsExistingEmployee(false);
            setMessage("No se encontró al empleado");
        }
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
        setMessage("");
    };

    return (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-row gap-4 mb-2">
                <div className="w-3/4">
                    <label htmlFor="employee-select" className="block text-sm font-medium leading-6 mb-2 text-gray-900">Seleccionar Empleado</label>
                    <select
                        id="employee-select"
                        value={createForm.id || ""}
                        onChange={handleEmployeeSelect}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

            {/* Input de búsqueda por email */}
            <div className="flex flex-row gap-4 mb-2">
                <div className="w-3/4">
                    <label htmlFor="email-search" className="block text-sm font-medium leading-6 mb-2 text-gray-900">Buscar por Email</label>
                    <input
                        onChange={handleInputEmailChange}
                        type="text"
                        name="emailSearch"
                        className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    className="mt-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    Buscar
                </button>
            </div>

            <div className={`mb-4 text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
            </div>

            {/* Campos de entrada del formulario */}
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Información Personal</h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Nombre</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="name" value={createForm.name || ""} className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Apellido</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="lastName" value={createForm.lastName || ""} className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} name="email" value={createForm.email || ""} type="email" className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">DNI</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="dni" value={createForm.dni || ""} className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        {/* ... Resto de campos con la misma lógica ... */}
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Rol</label>
                            <div className="mt-2">
                                <input onChange={handleInputCreateChange} type="text" name="role" value={createForm.role || ""} className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button onClick={handleCancel} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancelar</button>
                {isExistingEmployee ? (
                    <>
                        <button onClick={handleUpdate} type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Actualizar</button>
                        <button onClick={handleDelete} type="button" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">Eliminar</button>
                    </>
                ) : (
                    <button onClick={handleSave} type="button" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Guardar</button>
                )}
            </div>
        </form>
    );
};