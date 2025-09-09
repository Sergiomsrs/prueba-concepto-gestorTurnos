import { useEffect, useState } from "react";
import { employess, generateData, generateShiftData } from "../utils/shiftGeneratorData";
import { getGenericShiftWeek } from "../services/shiftService";

const API_URL = import.meta.env.VITE_API_URL;

export const useCyclesGenerator = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        // Si necesitas datos locales
        //setData(generateData(1, employess));

        // Función async dentro del useEffect
        const fetchData = async () => {
            try {
                const dat = await getGenericShiftWeek();
                console.log(dat); // Aquí ya tienes los datos resueltos
                // Si quieres actualizar el estado:
                setData(dat);
            } catch (error) {
                console.error("Error fetching generic shifts:", error);
                setData(generateData(1, employess));
            }
        };

        fetchData();
    }, []);



    const handleSaveCycle = () => {
        const dataToSave = generateShiftData(data, 2)
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
        setData,
        handleSaveCycle,
    }

}