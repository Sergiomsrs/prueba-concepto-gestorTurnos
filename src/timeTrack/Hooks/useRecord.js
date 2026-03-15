import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosClient } from "@/services/axiosClient";
import { timestampMockData } from "@/utils/apiMock";


export const useRecord = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedDayRecords, setSelectedDayRecords] = useState(null);
  const [lastThree, setLastThree] = useState([]);
  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-11
  });

  const { auth } = useContext(AuthContext);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usamos axiosClient con params para una URL más limpia
      const response = await axiosClient.get('/emp/active-by-month', {
        params: {
          month: activeTab.month + 1,
          year: activeTab.year
        }
      });

      // Axios ya devuelve el JSON parseado en .data
      setEmployees(response.data);
    } catch (error) {
      // Si la petición fue bloqueada por el interceptor de modo demo, 
      // no entrará aquí o se quedará en la promesa pendiente.
      setError(error.response?.data?.message || 'Error al obtener empleados');
      // Limpiar registros si hay error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async (currentTab) => {
    // Usamos el parámetro currentTab que recibe la función
    const tabToUse = currentTab || activeTab;

    if (!selectedEmployeeId) {
      setRecords([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const targetId = (auth.role === "ADMIN" || auth.role === "GUEST")
        ? selectedEmployeeId
        : auth.user.id;

      const response = await axiosClient.get(`/timestamp/employee/${targetId}/month`, {
        params: {
          year: tabToUse.year,
          month: tabToUse.month + 1
        }
      });

      setRecords(response.data);
    } catch (error) {
      setError("Error al cargar registros");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastThree = async () => {
    try {
      const response = await axiosClient.get('/timestamp/last3');
      setLastThree(response.data);
    } catch (err) {
      console.error("Error al cargar los últimos registros:", err);
    }
  };

  return {
    fetchEmployees,
    fetchRecords,
    fetchLastThree,
    records,
    error,
    employees,
    isLoading,
    selectedEmployeeId,
    selectedDayRecords,
    lastThree,
    activeTab,
    setRecords,
    setError,
    setEmployees,
    setIsLoading,
    setSelectedEmployeeId,
    setSelectedDayRecords,
    setLastThree,
    setActiveTab
  };
};