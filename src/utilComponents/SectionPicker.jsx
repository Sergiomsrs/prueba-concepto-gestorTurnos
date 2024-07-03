import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { employess } from "../utils/data";



export const SectionPicker = () => {

    const {selectedOption, setSelectedOption} = useContext(AppContext);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
      };


  return (
    <div>
      <label htmlFor="options">Select an option:</label>
      <select id="options"  value={selectedOption} onChange={handleChange}>
        {
          employess.map(emp =>(
            <option key={emp.seccion} value={emp.seccion}>{emp.seccion}</option>

          ))
        }
        
      </select>
    </div>
)
}
