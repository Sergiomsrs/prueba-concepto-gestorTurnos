import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShift } from "../services/shiftService";

function floorToQuarterHour(time) {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const floored = Math.floor(minute / 15) * 15;
    return `${hour.toString().padStart(2, "0")}:${floored.toString().padStart(2, "0")}`;
}

export const useShift = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ employeeId, date, startTime, endTime }) =>
            fetchShift.saveIndividualShift({
                employeeId: Number(employeeId),
                date,
                startTime: floorToQuarterHour(startTime),
                endTime: floorToQuarterHour(endTime),
            }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["roster"] });
            onSuccess?.(data);
        },
        onError,
    });
};