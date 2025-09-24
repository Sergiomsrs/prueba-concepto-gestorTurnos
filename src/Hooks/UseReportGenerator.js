import { useState } from "react"
import { reportBetwenDates } from "../services/reportService";

export const UseReportGenerator = () => {
    const [report, setReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetReportBetweenDates = async (startDate, endDate) => {
        setIsLoading(true);
        setError(null);
        try {
            setReport([])
            const response = await reportBetwenDates(startDate, endDate);
            setReport(response);
        } catch (error) {
            setError("Error obteniendo ciclo");
            console.error("Error obteniendo ciclo:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        report,
        isLoading,
        error,
        handleGetReportBetweenDates
    }
}
