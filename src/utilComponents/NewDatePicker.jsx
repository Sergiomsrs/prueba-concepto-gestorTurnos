import { useContext } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";


export const NewDatePicker = ({ activeTab, setActiveTab}) => {

  const { auth } = useContext(AuthContext);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();





  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (e) => {
    setActiveTab({ ...activeTab, month: parseInt(e.target.value)});
  };

  const handleYearChange = (e) => {
    setActiveTab({ ...activeTab, year: parseInt(e.target.value) });
  };

 
  return (
    <div className="rounded-lg border border-indigo-200 bg-white p-4 w-full  flex flex-wrap gap-4 h-fit mb-4">
      <div className='w-full'>

        <select
          value={activeTab.year ?? currentYear}
          onChange={handleYearChange}
          className="w-full cursor-pointer rounded-md py-2 text-center text-xs sm:text-sm font-medium md:text-base  bg-indigo-600 text-white shadow-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className='w-full'>


        <select
          value={activeTab.month ?? currentMonth}
          onChange={handleMonthChange}
          className="w-full rounded-md border py-2 text-sm md:text-base text-center text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>


      <div className='w-full'>
      </div>
    </div>
  );
};
