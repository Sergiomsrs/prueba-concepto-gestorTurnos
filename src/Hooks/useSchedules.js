import { useState, useEffect } from 'react';
import { timestampSchedulesMock } from '../utils/apiMock';

export const useSchedules = (employeeId, startDate, endDate) => {
  const [data, setData] = useState(timestampSchedulesMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:8081/api/schedule/employee/${employeeId}/schedules?startDate=${startDate}&endDate=${endDate}`
        );
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        
        const schedules = await response.json();
        setData(schedules);
      } catch (err) {
        setError(err.message || 'Error desconocido');
        console.error('Error al buscar horarios:', err);
        setData(timestampSchedulesMock)
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && startDate && endDate) {
      fetchSchedules();
    }
  }, [employeeId, startDate, endDate]);

  console.log("data", data)

  return { data, loading, error };
};