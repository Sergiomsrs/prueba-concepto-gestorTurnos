import { axiosClient } from "@/services/axiosClient";


export const getActiveEmployees = async () => {
    const response = await axiosClient.get('/api/user/active');
    return response.data;
};

export const getEmployeeRecordsByMonth = async (employeeId, year, month) => {
    // Pasamos los parámetros de consulta (query params) de forma limpia
    const response = await axiosClient.get(`/api/timestamp/employee/${employeeId}/month`, {
        params: { year, month }
    });
    return response.data;
};

export const getLastThreeRecords = async () => {
    const response = await axiosClient.get('/api/timestamp/last3');
    return response.data;
};