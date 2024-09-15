import { generateDatawithDate, generateDays } from "../utils/function";


export const DatePicker = ({ setDate, date, setData, setSelectedOption }) => {

  const handleChange = (event, type) => {
    const newValue = event.target.value;
    if (type === "start") {
      setDate({ ...date, start: newValue });
    } else if (type === "end") {
      setDate({ ...date, end: newValue });
    }
  };

/* 
  const handleClick = () => {

    fetch(`http://localhost:8081/day/${date.start}/${date.end}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        console.log(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setSelectedOption('todos');

  }

*/
  
    const handleClick = () => {
      const dates = generateDays(date.start)
      setData(generateDatawithDate(dates))
    }
  


  return (
    <div className="flex items-center mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          name="start"
          type="date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Select date start"
          value={date.start}
          onChange={(event) => handleChange(event, "start")}
        />
      </div>
      <span className="mx-4 text-gray-500">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          name="end"
          type="date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Select date end"
          value={date.end}
          onChange={(event) => handleChange(event, "end")}
        />
      </div>

      <div className="ml-4">
        <button
          onClick={handleClick}
          className="bg-sky-600
    border dark:border-sky-900 border-sky-900
    rounded-full
    inline-flex justify-center items-center gap-x-2
    py-1 px-2 md:py-2 md:px-4
    text-xs md:text-base text-white
    transition
    hover:scale-110 hover:bg-white/10">Refrescar</button>
      </div>
    </div>
  );
};
