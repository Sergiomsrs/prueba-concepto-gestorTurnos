import { useState, useEffect, useContext } from 'react';
import { dispMockData, ptoMockData, timestampSchedulesMock } from '../utils/apiMock';
import { fetchAbsences, searchPtoByEmployee } from '../services/employees'; // Importa tu método
import { AuthContext } from '../timeTrack/context/AuthContext';
import { axiosClient } from '@/services/axiosClient';

export const useSchedules = (employeeId, startDate, endDate) => {
  const [data, setData] = useState(timestampSchedulesMock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeePto, setEmployeePto] = useState(ptoMockData);
  const [disponibility, setDisponibility] = useState(dispMockData);
  const { auth } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL;


  const employeeToFecth = (auth.role == "ADMIN" || auth.isAuthenticated == false) ? employeeId : auth.user?.id

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosClient.get(
          `/schedule/employeeday/${employeeToFecth}/schedules`,
          {
            params: {
              startDate,
              endDate,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error("Error al buscar horarios:", err);
        setError(err.message || "Error desconocido");
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