import { useState } from "react"
import { AppContext } from "./AppContext"
import { apiMockData, SchedulesMock } from "../utils/apiMock";
import { getShiftWeek } from "../services/shiftService";
import { generateShiftData } from "../utils/function";

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

    const saveData = () => {
        const shiftData = generateShiftData(data);

        fetch(`${API_URL}/ws/saveAll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shiftData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setAlert({
                        isOpen: true,
                        message: { type: "success", text: data.message }
                    });
                } else {
                    setAlert({
                        isOpen: true,
                        message: { type: "error", text: "⚠️ " + data.message + "\nDetalles: " + (data.data || "") }
                    });
                }
                setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
            })
            .catch(error => {
                setAlert({
                    isOpen: true,
                    message: { type: "error", text: "Error de red al conectar con el servidor" }
                });
                setTimeout(() => setAlert({ isOpen: false, message: null }), 2500);
            });
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
            data,
            selectedOption,
            date,
            holidayDates,
            schedules,
            loading,
            error,
            alert,
            setAlert,
            fetchShiftWeek,
            saveData,
            resetData,

            setData,
            setSelectedOption,
            setDate,
            setHolidayDates,
            setSchedules
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */