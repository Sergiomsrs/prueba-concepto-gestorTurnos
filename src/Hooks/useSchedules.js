import { useState, useEffect } from 'react';
import { ptoMockData, timestampSchedulesMock } from '../utils/apiMock';
import { searchPtoByEmployee } from '../services/employees'; // Importa tu método

export const useSchedules = (employeeId, startDate, endDate) => {
  const [data, setData] = useState(timestampSchedulesMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeePto, setEmployeePto] = useState(ptoMockData);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8081/api/schedule/employeeday/${employeeId}/schedules?startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }

        const schedules = await response.json();
        setData(schedules);
      } catch (err) {
        setError(err.message || 'Error desconocido');
        console.error('Error al buscar horarios:', err);
        setData(timestampSchedulesMock);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && startDate && endDate) {
      fetchSchedules();
    }
  }, [employeeId, startDate, endDate]);

  // Nuevo useEffect para PTO
  useEffect(() => {
    const fetchPto = async () => {
      try {
        if (employeeId) {
          const ptoList = await searchPtoByEmployee(employeeId);
          setEmployeePto(ptoList);
        }
        // Si no hay employeeId, puedes decidir si lo vacías o no
      } catch (err) {
        // No sobrescribas employeePto, así mantiene ptoMockData
        console.error('Error al buscar ausencias del empleado:', err);
      }
    };

    fetchPto();
  }, [employeeId]);

  console.log('data', employeePto);

  return { data, loading, error, employeePto };
};