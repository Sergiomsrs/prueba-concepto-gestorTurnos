import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShift } from "../services/shiftService";
import { axiosClient } from "../services/axiosClient";

function floorToQuarterHour(time) {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const floored = Math.floor(minute / 15) * 15;
    return `${hour.toString().padStart(2, "0")}:${floored.toString().padStart(2, "0")}`;
}

function buildWorkShiftFromTimes(startTime, endTime) {
    const workShift = Array(96).fill("Null");
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startIndex = startH * 4 + Math.floor(startM / 15);
    const endIndex = endH * 4 + Math.floor(endM / 15);
    for (let i = startIndex; i < endIndex && i < 96; i++) {
        workShift[i] = "WORK";
    }
    const totalMinutes = (endIndex - startIndex) * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const shiftDuration = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    return { workShift, shiftDuration };
}

function hasExistingShift(currentData, employeeId, date) {
    if (!currentData || !currentData.length) return false;
    for (const day of currentData) {
        if (day.id !== date) continue;
        const emp = day.employees?.find((e) => Number(e.id) === Number(employeeId));
        if (!emp?.workShift) return false;
        return emp.workShift.some((slot) => slot === "WORK");
    }
    return false;
}

export const useShift = ({ onSuccess, onError } = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ employeeId, date, startTime, endTime, currentData }) => {
            const flooredStart = floorToQuarterHour(startTime);
            const flooredEnd = floorToQuarterHour(endTime);

            const exists = hasExistingShift(currentData, employeeId, date);

            if (exists) {
                const { workShift, shiftDuration } = buildWorkShiftFromTimes(flooredStart, flooredEnd);
                const response = await axiosClient.post("/schedule/saveAll", [
                    {
                        employeeId: Number(employeeId),
                        hours: workShift,
                        date,
                        shiftDuration,
                    },
                ]);
                return { status: response.status, data: response.data };
            }

            return fetchShift.saveIndividualShift({
                employeeId: Number(employeeId),
                date,
                startTime: flooredStart,
                endTime: flooredEnd,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["roster"] });
            onSuccess?.(data);
        },
        onError,
    });
};
