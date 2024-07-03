import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { employess } from "../utils/data";



export const SectionPicker = () => {

    const {selectedOption, setSelectedOption} = useContext(AppContext);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
      };
      
      const uniqueSections = employess.reduce((acc, emp) => {
        if (!acc.includes(emp.seccion)) {
          acc.push(emp.seccion);
        }
        return acc;
      }, []);


  return (
    <div>
      <label htmlFor="options">Select an option:</label>
      <select id="options"  value={selectedOption} onChange={handleChange}>
      <option value="todos">Todos</option>
        {   
          uniqueSections.map(emp =>(
            <option key={emp} value={emp}>{emp}</option>

          ))
        }
        
      </select>
    </div>
)
}
