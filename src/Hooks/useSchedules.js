import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../timeTrack/context/AuthContext";
import { axiosClient } from "@/services/axiosClient";
import { fetchAbsences, searchPtoByEmployee } from "../services/employees";

export const useSchedules = (employeeId, startDate, endDate) => {
  const { auth } = useContext(AuthContext);

  const employeeToFetch =
    auth.role === "ADMIN" || auth.isAuthenticated === false
      ? employeeId
      : auth.user?.id;

  // --- SHIFTS (nuevo endpoint) ---
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
    enabled: !!employeeToFetch && !!startDate && !!endDate,
  });

  // --- PTO ---
  const ptoQuery = useQuery({
    queryKey: ["pto", employeeToFetch],
    queryFn: () => searchPtoByEmployee(employeeToFetch),
    enabled: !!employeeToFetch,
  });

  // --- DISPONIBILITY ---
  const disponibilityQuery = useQuery({
    queryKey: ["disponibility", employeeToFetch],
    queryFn: async () => {
      const res = await fetchAbsences(employeeToFetch);
      if (res.status !== 200) throw new Error("Error fetching disponibility");
      return res.data;
    },
    enabled: !!employeeToFetch,
  });

  return {
    data: schedulesQuery.data ?? [],
    loading: schedulesQuery.isLoading,
    error: schedulesQuery.error,

    employeePto: ptoQuery.data ?? [],
    disponibility: disponibilityQuery.data ?? [],
  };
};