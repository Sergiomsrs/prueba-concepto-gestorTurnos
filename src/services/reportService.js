const API_URL = import.meta.env.VITE_API_URL;

export const reportBetwenDates = async (startDate, endDate) => {
    try {
        const response = await fetch(`${API_URL}/report/month-report/${startDate}/${endDate}`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};