import { axiosClient } from "./axiosClient";


export const reportBetwenDates = async (startDate, endDate) => {
    try {
        const response = await axiosClient.get(`/report/month-report/${startDate}/${endDate}`);

        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || `Error al obtener el reporte: ${error.message}`;
        console.error("Report Error:", message);
        throw error;
    }
};