import { useEffect, useState } from "react"
import { getAllEmployees, fetchDisponibilities, fetchPto } from "../services/employees"


const createFormInitialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };
const PtoFormInitialState = { name: '', lastName: '', email: '', ptoStartDate: '', ptoTerminationDate: '' };


export const useEmployees = () => {

    const [allEmployees, setAllEmployees] = useState([])
    const [activeEmployees, setactiveEmployees] = useState([])
    const [createForm, setCreateForm] = useState(createFormInitialState);
    const [message, setMessage] = useState("");
    const [workHours, setWorkHours] = useState([]);
    const [ptoCreateForm, setPtoCreateForm] = useState(PtoFormInitialState);
    const [ptoList, setPtoList] = useState([]);


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
                const { status, data } = await fetchDisponibilities.getDisponibilities(selectedId);
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
            await fetchDisponibilities.deleteDisponibilityById(dispId);
            // Recarga las ausencias del empleado seleccionado
            if (createForm.id) {
                const { status, data } = await fetchDisponibilities.getDisponibilities(createForm.id);
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
            await fetchDisponibilities.saveDisponibility(disponibilityData);
            if (createForm.id) {
                const { status, data } = await fetchDisponibilities.getDisponibilities(createForm.id);
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

    const handlePtoEmployeeSelect = async (selectedId, allEmployees, setPtoList) => {
        const selectedEmployee = allEmployees.find(emp => emp.id.toString() === selectedId);

        if (selectedEmployee) {
            setPtoCreateForm(selectedEmployee);
            setMessage("");
            try {
                const { status, data } = await fetchPto.getPtoList(selectedId);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setPtoList([]);
                } else {
                    setMessage("");
                    setPtoList(data);
                }
            } catch (error) {
                console.error("Error al cargar jornadas:", error);
                setMessage("Hubo un problema al cargar las jornadas.");
                setPtoList([]);
            }
        } else {
            setPtoCreateForm(PtoFormInitialState);
            setPtoList([]);
        }
    };

    const handleSavePto = async (PtoData) => {
        try {
            await fetchPto.savePto(PtoData);
            if (ptoCreateForm.id) {
                const { status, data } = await fetchPto.getPtoList(ptoCreateForm.id);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setPtoList([]);
                } else {
                    setMessage("");
                    setPtoList(data);
                }
            }
        } catch (error) {
            setMessage("Error al guardar la ausencia.");
            console.error(error);
        }
    };

    const handleDeletePto = async (ptoId, startDate, terminationDate) => {
        try {
            // Si necesitas usar dates o pto, hazlo aquí (actualmente no se usan en la petición)
            // const dates = getDatesInRange(startDate, terminationDate);
            // const pto = generatePtoNullWithDate(ptoCreateForm.id, dates);

            await fetchPto.deletePtoById(ptoId);

            // Recarga la lista de PTO del empleado seleccionado
            if (ptoCreateForm.id) {
                const { status, data } = await fetchPto.getPtoList(ptoCreateForm.id);
                if (status === 204) {
                    setMessage("No hay ausencias registradas.");
                    setPtoList([]);
                } else {
                    setMessage("");
                    setPtoList(data);
                }
            }
        } catch (error) {
            setMessage("Error al eliminar la ausencia.");
            console.error(error);
        }
    };



    return {
        activeEmployees,
        allEmployees,
        createForm,
        message,

        workHours,

        handleDeleteDisponibility,
        handleEmployeeSelect,
        handleGetAllEmployees,
        handleSaveDisponibility,
        setCreateForm,
        setMessage,

        setWorkHours,
        ptoCreateForm,
        setPtoCreateForm,
        handlePtoEmployeeSelect,
        handleDeletePto,
        handleSavePto,
        ptoList, setPtoList
    }
}
