import { useState, useEffect, useContext } from 'react';
import { dispMockData, ptoMockData, timestampSchedulesMock } from '../utils/apiMock';
import { fetchAbsences, searchPtoByEmployee } from '../services/employees'; // Importa tu método
import { AuthContext } from '../timeTrack/context/AuthContext';

export const useSchedules = (employeeId, startDate, endDate) => {
  const [data, setData] = useState(timestampSchedulesMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeePto, setEmployeePto] = useState(ptoMockData);
  const [disponibility, setDisponibility] = useState(dispMockData);
  const { auth } = useContext(AuthContext);


  const employeeToFecth = (auth.role == "ADMIN" || auth.isAuthenticated == false) ? employeeId : auth.user?.id

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);


        const response = await fetch(
          `http://localhost:8081/api/schedule/employeeday/${employeeToFecth}/schedules?startDate=${startDate}&endDate=${endDate}`
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
          const ptoList = await searchPtoByEmployee(employeeToFecth);
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


  useEffect(() => {
    if (!employeeId) return;
    fetchAbsences(employeeToFecth)
      .then(result => {
        if (result.status !== 200) {
          setDisponibility(dispMockData);
        } else {
          setDisponibility(result.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [employeeId]);

  return { data, loading, error, employeePto, disponibility };
};