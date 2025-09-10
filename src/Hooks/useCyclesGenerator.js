import { useEffect, useState } from "react";
import { employess, generateData, generateShiftData } from "../utils/shiftGeneratorData";
import { getGenericShiftWeek } from "../services/shiftService";
import { getCycle } from "../services/genericShiftService";

const API_URL = import.meta.env.VITE_API_URL;

export const useCyclesGenerator = () => {

    const [data, setData] = useState([])
    const [ciclo, setCiclo] = useState("");

    useEffect(() => {

        setData(generateData(1, employess))

    }, []);

    const handleGetCycle = async (cicle) => {
        try {
            const response = await getCycle(cicle); // llamada al fetch
            setData(response); // guarda en estado
        } catch (error) {
            console.error("Error obteniendo ciclo:", error);
        }
    };



    const handleSaveCycle = () => {
        const dataToSave = generateShiftData(data, ciclo)
        console.log(dataToSave)

        fetch(`${API_URL}/gs/saveAll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta completa del backend:", data);
                if (data.status === "success") {
                    console.log("Vamos Bien")
                }

            })
            .catch(error => {
                console.log("Vamos Mal")
            });
    };



    return {
        data,
        ciclo,
        setCiclo,
        setData,
        handleSaveCycle,
        handleGetCycle
    }

}