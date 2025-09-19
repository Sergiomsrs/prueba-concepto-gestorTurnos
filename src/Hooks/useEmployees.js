import { useEffect, useState } from "react"
import { getAllEmployees, getEmployeesData } from "../services/employees"


const createFormInitialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };
const newPtoInicitalState = { employeeId: "", absenceReason: "", date: "", startHour: "", terminationHour: "" };


export const useEmployees = () => {

    const [allEmployees, setAllEmployees] = useState([])
    const [activeEmployees, setactiveEmployees] = useState([])
    const [createForm, setCreateForm] = useState(createFormInitialState);
    const [message, setMessage] = useState("");
    const [workHours, setWorkHours] = useState([]);
    const [newPto, setNewPto] = useState(newPtoInicitalState);


    useEffect(() => {
        handleGetAllEmployees()
    }, []);


    const handleGetAllEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setAllEmployees(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }

    const handleEmployeeSelect = async (selectedId, allEmployees) => {
        const selectedEmployee = allEmployees.find(emp => emp.id.toString() === selectedId);

        if (selectedEmployee) {
            setCreateForm(selectedEmployee);
            setMessage("");
            try {
                const { status, data } = await getEmployeesData.getDisponibilities(selectedId);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setWorkHours([]);
                } else {
                    setMessage("");
                    setWorkHours(data);
                }
            } catch (error) {
                console.error("Error al cargar jornadas:", error);
                setMessage("Hubo un problema al cargar las jornadas.");
            }
        } else {
            setCreateForm(initialState);
            setWorkHours([]);
        }
    };

    const handleDeleteDisponibility = async (dispId) => {
        try {
            await getEmployeesData.deleteDisponibilityById(dispId);
            // Recarga las ausencias del empleado seleccionado
            if (createForm.id) {
                const { status, data } = await getEmployeesData.getDisponibilities(createForm.id);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setWorkHours([]);
                } else {
                    setMessage("");
                    setWorkHours(data);
                }
            }
        } catch (error) {
            setMessage("Error al eliminar la ausencia.");
            console.error(error);
        }
    };

    const handleSaveDisponibility = async (disponibilityData) => {
        try {
            await getEmployeesData.saveDisponibility(disponibilityData);
            if (createForm.id) {
                const { status, data } = await getEmployeesData.getDisponibilities(createForm.id);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setWorkHours([]);
                } else {
                    setMessage("");
                    setWorkHours(data);
                }
            }
        } catch (error) {
            setMessage("Error al guardar la ausencia.");
            console.error(error);
        }
    };



    return {
        activeEmployees,
        allEmployees,
        createForm,
        message,
        newPto,
        newPtoInicitalState,
        workHours,

        handleDeleteDisponibility,
        handleEmployeeSelect,
        handleGetAllEmployees,
        handleSaveDisponibility,
        setCreateForm,
        setMessage,
        setNewPto,
        setWorkHours,
    }
}
