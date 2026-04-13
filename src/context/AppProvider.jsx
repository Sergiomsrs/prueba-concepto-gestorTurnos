import { useState } from "react"
import { AppContext } from "./AppContext"
import { apiMockData, SchedulesMock } from "../utils/apiMock";
import { getShiftWeek } from "../services/shiftService";
import { generateShiftData } from "../utils/function";
import { axiosClient } from "@/services/axiosClient";

const API_URL = import.meta.env.VITE_API_URL;

export const AppProvider = ({ children }) => {

    const [data, setData] = useState(apiMockData);
    const [schedules, setSchedules] = useState(SchedulesMock);
    const [selectedOption, setSelectedOption] = useState('todos');
    const [date, setDate] = useState({ start: '', end: '' });
    const [holidayDates, setHolidayDates] = useState(["2024-01-01", "2024-01-06", "2024-04-19", "2024-05-01", "2024-06-06", "2024-08-15", "2024-09-03", "2024-10-12", "2024-11-01", "2024-12-06", "2024-12-08", "2024-12-25"]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ isOpen: false, message: null });
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem("activeTab");
        return saved !== null ? Number(saved) : 0;
    });

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        selectedTeams: [],
        employeeName: "",
        hideZeroHours: false,
        displayHourRange: {
            startHour: 7,
            endHour: 22.5,
        }, // ✅ NUEVO: Rango visible (no modifica dataframe interno)
    });

    const [appliedDates, setAppliedDates] = useState({
        startDate: null,
        endDate: null,
    });



    const fetchShiftWeek = async (startDate, endDate) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getShiftWeek(startDate, endDate);
            setData(result);
            setAlert({
                isOpen: true,
                message: { type: "success", text: "Datos cargados correctamente" },
            });
        } catch (err) {
            setError(err);
            console.log(err)
            setAlert({
                isOpen: true,
                message: { type: "error", text: "Error al cargar los datos" },
            });
        } finally {
            setLoading(false);
            setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
        }
    };

    const saveData = async () => {
        const shiftData = generateShiftData(data);

        try {
            // Axios procesa automáticamente el body y las cabeceras JSON
            const response = await axiosClient.post('/ws/saveAll', shiftData);

            // Axios pone el cuerpo de la respuesta en .data
            const result = response.data;

            if (result.status === "success") {
                setAlert({
                    isOpen: true,
                    message: { type: "success", text: result.message }
                });
            } else {
                setAlert({
                    isOpen: true,
                    message: { type: "error", text: "⚠️ " + result.message + "\nDetalles: " + (result.data || "") }
                });
            }
        } catch (error) {
            // Manejo de errores de red o errores del servidor (4xx, 5xx)
            setAlert({
                isOpen: true,
                message: { type: "error", text: "Error de red al conectar con el servidor" }
            });
        } finally {
            // Se ejecuta siempre después del éxito o del error
            setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
        }
    };

    const resetData = () => {
        setData(prevData =>
            prevData.map(day => ({
                ...day,
                employees: day.employees.map(employee => ({
                    ...employee,
                    workShift: Array(62).fill("Null"),
                    shiftDuration: '00:00'
                }))
            }))
        );
    };

    return (
        <AppContext.Provider value={{
            activeTab,
            alert,
            data,
            date,
            error,
            holidayDates,
            loading,
            schedules,
            selectedOption,
            filters,
            appliedDates,

            fetchShiftWeek,
            resetData,
            saveData,
            setActiveTab,
            setAlert,
            setData,
            setDate,
            setHolidayDates,
            setSchedules,
            setSelectedOption,
            setFilters,
            setAppliedDates
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */