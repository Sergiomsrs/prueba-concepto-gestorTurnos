import { useState } from 'react';
import { CloseIcon } from '../icon/CloseIcon';

export const SideBar = ({ sideBarClick, isOpen }) => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [date, setDate] = useState({ start: '', end: '' });
    const [error, setError] = useState({ start: '', end: '' });

    const handleDateChange = (e) => {
      const { name, value } = e.target;
      const dateObj = new Date(value);
      if (value && dateObj.getDay() !== 1) {
        setError(prev => ({ ...prev, [name]: 'La semana debe iniciar en lunes' }));
        setDate(prev => ({ ...prev, [name]: '' }));
        return;
      }
      setError(prev => ({ ...prev, [name]: '' }));
      setDate(prev => ({
        ...prev,
        [name]: value,
      }));
    };

    const sideBarMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    }

    const handleSave = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:8081/api/schedule/copy-week', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceStartDate: date.start,
            targetStartDate: date.end,
          }),
        });
        if (!response.ok) throw new Error('Error al copiar semana');
        alert('Semana copiada correctamente');
        setIsOpenMenu(false);
        setDate({ start: '', end: '' });
      } catch (error) {
        alert(error.message);
      }
    };

    return (
        <aside
        className={`absolute top-0 left-0 z-50 flex flex-col w-96 h-full px-4 py-4 overflow-y-auto border border-slate-600 rounded-lg shadow-md bg-gray-200 bg-opacity-95 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <CloseIcon sideBarClick={sideBarClick} />
  
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="-mx-3 space-y-3">
            <button
              onClick={sideBarMenu}
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                />
              </svg>
              <span className="mx-2 text-sm font-medium">Duplicar Semana</span>
            </button>
  
            {isOpenMenu && (
              <div className="flex flex-col gap-2">
                 <span className="mx-4 text-gray-500">Inicio semana de origen</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                    value={date.start}
                    onChange={handleDateChange}
                    className={`bg-gray-50 border ${error.start ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Select date start"
                  />
                  {error.start && (
                    <p className="text-red-600 text-xs mt-1">{error.start}</p>
                  )}
                </div>
                <span className="mx-4 text-gray-500">Inicio semana de destino</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                    value={date.end}
                    onChange={handleDateChange}
                    className={`bg-gray-50 border ${error.end ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Select date end"
                  />
                  {error.end && (
                    <p className="text-red-600 text-xs mt-1">{error.end}</p>
                  )}
                </div>
  
                <div className="">
                  <button
                    onClick={handleSave}
                    className="bg-sky-600 border dark:border-sky-900 border-sky-900 rounded-full inline-flex justify-center items-center gap-x-2 py-1 px-2 md:py-2 md:px-4 text-xs md:text-base text-white transition hover:scale-110 hover:bg-white/10"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
  
            <a
              className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>
              <span className="mx-2 text-sm font-medium">Dashboard</span>
            </a>
          </nav>
        </div>
      </aside>
    );
};

