import { useEffect, useState } from "react";
import { generatePtoNullWithDate, generatePtoWithDate, getDatesInRange } from "../utils/function";

export const AddDisp = () => {
    const initialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };

    const [createForm, setCreateForm] = useState(initialState);
    const [message, setMessage] = useState("");
    const [employees, setEmployees] = useState([]); // Estado para la lista de empleados
    const [isExistingEmployee, setIsExistingEmployee] = useState(false);
    const [workHours, setWorkHours] = useState([]);
    const [newPto, setNewPto] = useState({employeeId: "",
        absenceReason: "",
        date: "",
        startHour: "",
        terminationHour: ""}); // Estado para la nueva jornada
        console.log(newPto)
    // Cargar todos los empleados cuando el componente se monta
    useEffect(() => {
        fetch('http://localhost:8081/api/emp/findall') // URL para obtener todos los empleados
            .then(response => response.json())
            .then(data => setEmployees(data))
            .catch(error => console.error("Error al cargar empleados:", error));
    }, []);


    console.log("Data to send:", {
        employeeId: createForm.id,
        absenceReason: newPto.absenceReason,
        date: newPto.date,
        startHour: newPto.startHour,
        terminationHour: newPto.terminationHour,  // Verifica que esto tiene un valor válido
      });






    const handleEmployeeSelect = (e) => {
        const selectedId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.id.toString() === selectedId);

        if (selectedEmployee) {
            setCreateForm(selectedEmployee);
            setMessage("");

            fetch(`http://localhost:8081/api/disp/${selectedId}`)
                .then(response => {
                    if (response.status === 204) {
                        setMessage("No hay ausencias registradas.");
                        setWorkHours([]);
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
                        setWorkHours(data);
                    }
                })
                .catch(error => {
                    console.error("Error al cargar jornadas:", error);
                    setMessage("Hubo un problema al cargar las jornadas.");
                });
        } else {
            setCreateForm(initialState);
            setIsExistingEmployee(false);
            setWorkHours([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPto(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dates = getDatesInRange(newPto.ptoStartDate, newPto.ptoTerminationDate);
        const pto = generatePtoWithDate(createForm.id, dates);

       /* // Primero, guardar los turnos
        fetch('http://localhost:8081/api/ws/saveAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pto),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
*/
        // Luego, guardar la ausencia
        fetch('http://localhost:8081/api/disp/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employeeId: createForm.id,
                absenceReason: newPto.absenceReason,
                date: newPto.date,
                startHour: newPto.startHour,
                terminationHour: newPto.terminationHour,
            }),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    };

    const handleDelete = () => {}

    const handleDeleteDisp = (dispId) => {

        fetch(`http://localhost:8081/api/disp/delete/${dispId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));
    }

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
            {workHours.length > 0 && (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Inicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hora de Fin</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {workHours.map((workHour) => (
                                <tr key={workHour.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{workHour.id}</td>
                                    <td className="px-4 py-2">{workHour.date}</td>
                                    <td className="px-4 py-2">{workHour.startHour || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.terminationHour || "N/A"}</td>
                                    <td className="px-4 py-2">{workHour.absenceReason}</td>
                                    <td className="px-4 py-2">
                                        <button
                                        onClick={()=>handleDeleteDisp(workHour.id)}
                                        className="rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white"
                                        >Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Formulario para añadir nueva jornada */}
            <div className="mt-6 space-y-4 ">
                <h3 className="text-lg font-semibold text-gray-900">Añadir Nueva Ausencia</h3>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3 mb-4">
                        <label htmlFor="absenceReason" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ausencia</label>
                        <input
                            type="text"
                            name="absenceReason"
                            id="absenceReason"
                            value={newPto.absenceReason}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                            />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={newPto.date}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                            </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                        <input
                            type="time"
                            name="startHour"
                            id="startHour"
                            value={newPto.startHour}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="terminationHour" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                        <input
                            type="time"
                            name="terminationHour"
                            id="terminationHour"
                            value={newPto.terminationHour}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm py-1.5 pl-2"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                    <button onClick={handleSubmit} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Save</button>
                </div>
            </div>
        </form>
    );
};
