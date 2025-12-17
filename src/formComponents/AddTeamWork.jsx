import { useEffect, useState } from "react"


export const AddTeamWork = () => {
    const initialState = { name: '', lastName: '', email: '', hireDate: '', terminationDate: '' };
    const [createForm, setCreateForm] = useState(initialState);
    const [message, setMessage] = useState("");
    const [employees, setEmployees] = useState([]); // Estado para la lista de empleados
    const [teamWork, setteamWork] = useState([]);
    const [newTeamWork, setNewTeamWork] = useState({ teamWork: "", twStartDate: "" }); // Estado para la nueva jornada
    const [isExistingEmployee, setIsExistingEmployee] = useState(false);

    // Cargar todos los empleados cuando el componente se monta
    useEffect(() => {
        fetch('http://localhost:8081/api/emp/findall') // URL para obtener todos los empleados
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error("Error al cargar empleados:", error));
    }, []);

    const handleEmployeeSelect = (e) => {
        const selectedId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.id.toString() === selectedId);

        if (selectedEmployee) {
            setCreateForm(selectedEmployee);
            setMessage("");

            fetch(`http://localhost:8081/api/teamwork/${selectedId}`)
                .then(response => {
                    if (response.status === 204) {
                        setMessage("No hay jornadas registradas.");
                        setteamWork([]);
                        return null;
                    }
                    if (!response.ok) {
                        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        setMessage("");
                        setteamWork(data);
                    }
                })
                .catch(error => {
                    console.error("Error al cargar jornadas:", error);
                    setMessage("Hubo un problema al cargar las jornadas.");
                });
        } else {
            setCreateForm(initialState);
            setIsExistingEmployee(false);
            setteamWork([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeamWork(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitNewTeamWork = (e) => {
        e.preventDefault();

        if (!newTeamWork.teamWork || !newTeamWork.twStartDate) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }

        fetch(`http://localhost:8081/api/teamwork/create?employeeId=${createForm.id}&teamWork=${newTeamWork.teamWork}&twStartDate=${newTeamWork.twStartDate}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al crear la jornada.");
                }
                setMessage("Jornada añadida exitosamente.");
                setNewTeamWork({ teamWork: "", twStartDate: "" });
                handleEmployeeSelect({ target: { value: createForm.id } });
            })
            .catch(error => {
                console.error("Error al añadir la jornada:", error);
                setMessage("Hubo un problema al añadir la jornada.");
            });
    };

    return (
        <form className="space-y-6">
            {/* Dropdown para seleccionar empleado */}
            <div className="flex flex-col gap-4 mb-4">
                <label htmlFor="employee-select" className="text-sm font-medium text-gray-700">Seleccionar Empleado</label>
                <select
                    id="employee-select"
                    onChange={handleEmployeeSelect}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5"
                >
                    <option value="">-- Seleccione un empleado --</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} {employee.lastName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Mensaje */}
            {message && <p className="text-red-500 text-sm">{message}</p>}

            {/* Tabla de jornadas */}
            {teamWork.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Inicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha Fin</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Equipo de trabajo</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {teamWork.map((teamWork) => (
                                <tr key={teamWork.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{teamWork.twStartDate}</td>
                                    <td className="px-4 py-2">{teamWork.twTerminationDate || "N/A"}</td>
                                    <td className="px-4 py-2">{teamWork.teamWork}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}



            {/* Formulario para añadir nueva jornada */}
            <div className="mt-6 space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-900">Añadir Equipo de Trabajo</h3>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3">
                        <label htmlFor="teamWork" className="block text-sm font-medium text-gray-700 mb-2">Equipo</label>
                        <input

                            name="teamWork"
                            id="teamWork"
                            value={newTeamWork.teamWork}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="twStartDate" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="twStartDate"
                            id="wwhStartDate"
                            value={newTeamWork.twStartDate}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 px-2"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>

                    <button onClick={handleSubmitNewTeamWork} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>

                </div>

            </div>
        </form>
    );
};
