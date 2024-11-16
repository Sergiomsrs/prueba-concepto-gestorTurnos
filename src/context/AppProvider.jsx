import { useState } from "react"
import { AppContext } from "./AppContext"
import { apiMockData } from "../utils/apiMock";


export const AppProvider = ({children})=> {

    //const [data, setData] = useState(generateData());
    //const [data, setData] = useState(generateDatawithDate(date.start) || generateData() );
    //const [data, setData] = useState(datamock4);
    const [data, setData] = useState(apiMockData);
    const [selectedOption, setSelectedOption] = useState('todos');
    const [date, setDate] = useState({ start: '', end: ''  });
    const [holidayDates , setHolidayDates ] = useState(["2024-01-01", "2024-01-06", "2024-04-19", "2024-05-01", "2024-06-06", "2024-08-15","2024-09-03", "2024-10-12", "2024-11-01", "2024-12-06", "2024-12-08", "2024-12-25"]);


    return(
        <AppContext.Provider value={{
            data, 
            selectedOption, 
            date,
            holidayDates,
            
            setData, 
            setSelectedOption,
            setDate,
            setHolidayDates
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */