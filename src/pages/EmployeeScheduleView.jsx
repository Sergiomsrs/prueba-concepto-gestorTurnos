import { useContext, useState, useEffect } from 'react'


import { DatePicker } from '../timeTrack/components/DatePicker';
import { AppContext } from '../context/AppContext';
import { fetchAbsences, getSchedules } from '../utils/timeManager';
import { EmployeeSchedule } from '../formComponents/EmployeeSchedule';
import { DispTable } from '../formComponents/utils/DispTable';
import { dispMockData } from '../utils/apiMock';


export const EmployeeScheduleView = ({ selectedEmployeeId }) => {

  const { schedules, setSchedules } = useContext(AppContext);
  const [workHours, setWorkHours] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;



  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // ¡OJO! aquí debe ser 1-12
  });

  let mes = activeTab.month + 1
  let { start, end } = getMonthRange(activeTab.year, mes)
  useEffect(() => {

    getSchedules(API_URL, start, end).then((data) => setSchedules(data))


  }, [activeTab]);

  useEffect(() => {
    fetchAbsences(selectedEmployeeId)
      .then(result => {
        if (result.status === 204) {
          setWorkHours([]);
        } else {
          setMessage("");
          setWorkHours(result.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [activeTab]);

  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getMonthRange(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      start: formatDateLocal(startDate),
      end: formatDateLocal(endDate),
    };
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className='mt-44'>
        <DatePicker
          employees={{}}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          setIsModalAddOpen={{}}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>
      <div className="col-span-3">
        <EmployeeSchedule data={schedules} />
      </div>
      <div className="col-span-2 mt-44">
        <h3 className='font-bold mb-6' >Solicitudes de Ausencia</h3>
        <DispTable workHours={dispMockData} />
      </div>
    </div>
  );
}
