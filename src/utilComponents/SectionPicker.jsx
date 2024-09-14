import { useContext } from "react";
import { AppContext } from "../context/AppContext";



export const SectionPicker = () => {

    const {data, selectedOption, setSelectedOption} = useContext(AppContext);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
      };
      
      const uniqueSections = data.reduce((acc, day) => {
        day.employees.forEach(emp => {
          if (!acc.includes(emp.teamWork)) {
            acc.push(emp.teamWork);
          }
        });
        return acc;
      }, []);


  return (
    <div className="mb-4">
  <label htmlFor="options" className="block text-gray-700 mb-2">Equipo de trabajo:</label>
  <select 
    id="options" 
    value={selectedOption} 
    onChange={handleChange} 
    className="block w-auto p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
  >
    <option value="todos">Todos</option>
    {uniqueSections.map(emp => (
      <option key={emp} value={emp}>{emp}</option>
    ))}
  </select>
</div>
)
}
