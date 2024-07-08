import { useState } from "react"
import { AppContext } from "./AppContext"
import { generateData } from "../utils/function"
import { datamock } from "../utils/mock";


export const AppProvider = ({children})=> {

    const [data, setData] = useState(generateData());
    //const [data, setData] = useState(datamock);
    const [selectedOption, setSelectedOption] = useState('todos');
    const [date, setDate] = useState({ start: '', end: '' });


    return(
        <AppContext.Provider value={{
            data, 
            selectedOption, 
            date,
            
            setData, 
            setSelectedOption,
            setDate
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */