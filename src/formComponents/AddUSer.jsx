import { useState } from "react";
import { axiosClient } from "@/services/axiosClient";

const initialState = {
    id: "",
    name: "",
    lastName: "",
    secondLastName: "",
    email: "",
    dni: "",
    password: "",
    role: "",
    hireDate: "",
    terminationDate: "",
    sortOrder: "",
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

    console.log(employees);

    const handleInputEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await axiosClient.post('/emp/create', createForm);
            setMessage("Usuario creado con éxito");
            setCreateForm(initialState);
        } catch (error) {
            setMessage("Error al crear usuario");
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            await axiosClient.put(`/emp/update/${createForm.id}`, createForm);
            console.log("Usuario actualizado:", createForm);
            setMessage("Usuario actualizado con éxito");
        } catch (error) {
            setMessage("Error al actualizar usuario");
        }
    };

    const handleDelete = async (e) => {
        if (e) e.preventDefault();
        try {
            await axiosClient.delete(`/emp/delete/${createForm.id}`);
            setMessage("Usuario eliminado exitosamente");
            setCreateForm(initialState);
            setIsExistingEmployee(false);
        } catch (error) {
            setMessage("Error al eliminar el usuario");
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axiosClient.get('/emp/search', { params: { email } });
            setCreateForm(response.data);
            setIsExistingEmployee(true);
            setMessage("");
        } catch (error) {
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
            {/* Buscador y Selector */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Seleccionar Empleado</label>
                    <select
                        id="employee-select"
                        value={createForm.id || ""}
                        onChange={handleEmployeeSelect}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                        <option value="">-- Seleccione un empleado --</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} {employee.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 flex gap-2 items-end">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-900 mb-2">Buscar por Email</label>
                        <input
                            onChange={handleInputEmailChange}
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Información del Trabajador</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    {/* Fila 1: Nombre y Apellidos */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">Nombre</label>
                        <input onChange={handleInputCreateChange} type="text" name="name" value={createForm.name || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">Primer Apellido</label>
                        <input onChange={handleInputCreateChange} type="text" name="lastName" value={createForm.lastName || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">Segundo Apellido</label>
                        <input onChange={handleInputCreateChange} type="text" name="secondLastName" value={createForm.secondLastName || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    {/* Fila 2: Credenciales */}
                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-900">Email Corporativo</label>
                        <input onChange={handleInputCreateChange} name="email" value={createForm.email || ""} type="email" className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-900">Password</label>
                        <input onChange={handleInputCreateChange} name="password" value={createForm.password || ""} type="password" placeholder="Mín. 8 caracteres" className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    {/* Fila 3: Identificación y Contrato */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">DNI / NIE</label>
                        <input onChange={handleInputCreateChange} type="text" name="dni" value={createForm.dni || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">Rol / Puesto</label>
                        <input onChange={handleInputCreateChange} type="text" name="role" value={createForm.role || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 font-bold text-indigo-600">Orden en Tabla</label>
                        <input
                            onChange={handleInputCreateChange}
                            type="number"
                            name="sortOrder"
                            value={createForm.sortOrder || ""}
                            placeholder="Ej: 1"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-indigo-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-indigo-50"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900">Fecha de Alta</label>
                        <input onChange={handleInputCreateChange} type="date" name="hireDate" value={createForm.hireDate || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 text-red-600">Fecha de Baja (si aplica)</label>
                        <input onChange={handleInputCreateChange} type="date" name="terminationDate" value={createForm.terminationDate || ""} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-x-4">
                <button onClick={handleCancel} type="button" className="text-sm font-semibold text-gray-900 hover:underline">
                    Limpiar formulario
                </button>
                {isExistingEmployee ? (
                    <>
                        <button onClick={handleDelete} type="button" className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                            Eliminar Empleado
                        </button>
                        <button onClick={handleUpdate} type="button" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                            Actualizar Datos
                        </button>
                    </>
                ) : (
                    <button onClick={handleSave} type="button" className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                        Dar de Alta
                    </button>
                )}
            </div>
        </form>
    );
};