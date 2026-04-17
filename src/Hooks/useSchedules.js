import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";
import { axiosClient } from "@/services/axiosClient";
import { fetchAbsences, searchPtoByEmployee } from "../services/employees";
// Importación de todos los mocks necesarios
import { shiftMockDaily, ptoMockData, dispMockData } from "@/utils/apiMock";

export const useSchedules = (employeeId, startDate, endDate) => {
  const { auth } = useContext(AuthContext);

  const isDemo = auth?.token === "demo-token-12345";

  const employeeToFetch =
    auth.role === "ADMIN" || auth.isAuthenticated === false
      ? employeeId
      : auth.user?.id;

  // --- SHIFTS ---
  const schedulesQuery = useQuery({
    queryKey: ["schedules", employeeToFetch, startDate, endDate],
    queryFn: async () => {
      const res = await axiosClient.get(
        `/schedule/employeeday/${employeeToFetch}/shifts`,
        {
          params: { startDate, endDate },
        }
      );
      return res.data;
    },
    enabled: !!employeeToFetch && !!startDate && !!endDate && !isDemo,
    initialData: isDemo ? shiftMockDaily : undefined,
  });

  // --- PTO ---
  const ptoQuery = useQuery({
    queryKey: ["pto", employeeToFetch],
    queryFn: () => searchPtoByEmployee(employeeToFetch),
    enabled: !!employeeToFetch && !isDemo,
    initialData: isDemo ? ptoMockData : undefined,
  });

  // --- DISPONIBILITY (Ausencias/Disponibilidad) ---
  const disponibilityQuery = useQuery({
    queryKey: ["disponibility", employeeToFetch],
    queryFn: async () => {
      const res = await fetchAbsences(employeeToFetch);
      if (res.status !== 200) throw new Error("Error fetching disponibility");
      return res.data;
    },
    enabled: !!employeeToFetch && !isDemo,
    initialData: isDemo ? dispMockData : undefined,
  });

  return {
    data: schedulesQuery.data ?? [],
    loading: isDemo ? false : (schedulesQuery.isLoading || ptoQuery.isLoading || disponibilityQuery.isLoading),
    error: schedulesQuery.error || ptoQuery.error || disponibilityQuery.error,

    employeePto: ptoQuery.data ?? [],
    disponibility: disponibilityQuery.data ?? [],
  };
};