import { useEffect, useState } from "react";
import { fetchPublicHolidays } from "../services/publicHolidaysService";



export const usePublicHolidays = () => {





    const [message, setMessage] = useState("");
    const [publicHolidays, setPublicHolidays] = useState([{
        "id": 1,
        "date": "2025-05-01",
        "type": "LEGAL",
        "description": "Día del Trabajo",
        "paid": true
    }, {
        "id": 2,
        "date": "2025-12-06",
        "type": "LEGAL",
        "description": "Día de la Constitución Española",
        "paid": true
    }]);

    useEffect(() => {
        findAllPublicHolidays()
    }, [])


    /* ----- Weekly Work Hours Methods ----- */

    const findAllPublicHolidays = async () => {
        try {
            const result = await fetchPublicHolidays.getAll();
            if (result.length === 0) {
                setMessage("No hay registros")
            }
            setPublicHolidays(result);
            console.log(result)

        } catch (error) {
            setMessage("No se encuentran Jornadas asignadas al empleado.");
            console.error(error);
            throw error;
        }
    }

    const handleSavePh = async (id, date, type, description, paid) => {

        setMessage("");

        try {
            await fetchPublicHolidays.savePh(id, date, type, description, paid);
            setMessage("Registro añadido correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            findAllPublicHolidays()
        } catch (error) {
            setMessage("Error al añadir el registro.");
            throw error;
        }
    }



    const handleDeletePh = async (id) => {

        try {
            await fetchPublicHolidays.deleteById(id);
            setMessage("Registro eliminado correctamente.");
            setTimeout(() => {
                setMessage("")
            }, 2000)
            findAllPublicHolidays()
        } catch (error) {
            setMessage("Error al eliminar el registro.");
            throw error;
        }
    }



    return {
        message,
        publicHolidays,
        handleSavePh,
        handleDeletePh,

        findAllPublicHolidays,
        setMessage,

    }
}