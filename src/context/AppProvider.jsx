import { useState } from "react"
import { AppContext } from "./AppContext"
import { generateData } from "../utils/function"


export const AppProvider = ({children})=> {

    const [data, setData] = useState(generateData());
    const [selectedOption, setSelectedOption] = useState('todos');


    return(
        <AppContext.Provider value={{
            data, 
            selectedOption, 
            
            setData, 
            setSelectedOption
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */