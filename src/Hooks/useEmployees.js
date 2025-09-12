import { useState } from "react"
import { getAllEmployees } from "../services/employees"

export const useEmployees = () => {

    const [allEmployees, setAllEmployees] = useState([])
    const [activeEmployees, setactiveEmployees] = useState([])

    const handleGetAllEmployees = async () => {
        try {
            const response = await getAllEmployees();
            setAllEmployees(response);
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }

    }



    return {
        allEmployees,
        activeEmployees,

        handleGetAllEmployees,
    }
}
