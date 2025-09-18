import { useContext } from "react";
import { AppContext } from "../context/AppContext";



export const SectionPicker = ({ data }) => {

  const { selectedOption, setSelectedOption } = useContext(AppContext);

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
    <div className="">
      <select
        id="options"
        value={selectedOption}
        onChange={handleChange}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition h-fit min-w-[120px]"
      >
        <option value="todos">Todos</option>
        {uniqueSections.map(emp => (
          <option key={emp} value={emp}>{emp}</option>
        ))}
      </select>
    </div>
  )
}
