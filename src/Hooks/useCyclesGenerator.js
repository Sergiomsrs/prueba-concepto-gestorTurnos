import { useEffect, useState } from "react";
import { employess, generateData, generateShiftData } from "../utils/shiftGeneratorData";


export const useCyclesGenerator = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        setData(generateData(1, employess))
    }, []);


    const handleSaveCycle = () => {
        const dataToSave = generateShiftData(data, 1)
        console.log(dataToSave)
    }




    return {
        data,
        setData,
        handleSaveCycle,
    }
}
