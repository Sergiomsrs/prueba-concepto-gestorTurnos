import { useState } from "react"
import { AppContext } from "./AppContext"
import { generateData } from "../utils/function"


export const AppProvider = ({children})=> {

    const [AppState, setAppState] = useState({})
    const [data, setData] = useState(generateData());
    const [selectedOption, setSelectedOption] = useState('option1');


    return(
        <AppContext.Provider value={{
            data, setData, selectedOption, setSelectedOption
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */