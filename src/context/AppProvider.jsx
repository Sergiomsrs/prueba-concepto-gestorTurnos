import { useState } from "react"
import { AppContext } from "./AppContext"
import { generateData, generateDatawithDate } from "../utils/function"
import { datamock, datamock2, datamock3, datamock4 } from "../utils/mock";
import { apiMockData } from "../utils/apiMock";


export const AppProvider = ({children})=> {

    //const [data, setData] = useState(generateData());
    //const [data, setData] = useState(generateDatawithDate(date.start) || generateData() );
    //const [data, setData] = useState(datamock4);
    const [data, setData] = useState(apiMockData);
    const [selectedOption, setSelectedOption] = useState('todos');
    const [date, setDate] = useState({ start: '', end: ''  });


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