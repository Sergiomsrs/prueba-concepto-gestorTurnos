import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const EmployeePicker = ({ value, onChange }) => {
    const { data } = useContext(AppContext);

    const uniqueNames = new Set();

    
    data.forEach((day) => {
        day.employees.forEach((employee) => {
            uniqueNames.add(employee.name);
        });
    });

    
    const handleSelectChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Selecciona el empleado</label>
            <div className="relative mt-2 mb-4 rounded-md shadow-sm">

                <div className="relative mt-2 rounded-md shadow-sm">
                    <select
                        id="name"
                        name="name"
                        value={value} 
                        onChange={handleSelectChange} 
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        {[...uniqueNames].map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
