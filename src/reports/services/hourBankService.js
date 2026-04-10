import { axiosClient } from "./axiosClient";

export const getLiquidationPeriods = async (year) => {
    const response = await axiosClient.get(`/liquidation-period?year=${year}`);
    return response.data;
};

export const getReportByPeriod = async (periodId) => {
    const response = await axiosClient.get(`/report/period/${periodId}`);
    return response.data;
};

export const getBanksByPeriod = async (periodId) => {
    const response = await axiosClient.get(`/hour-bank/period/${periodId}`);
    return response.data;
};

export const generateBanks = async (periodId) => {
    const response = await axiosClient.post(`/hour-bank/period/${periodId}/generate`);
    return response.data;
};

export const closeBank = async (hourBankId, hoursPaid, closedById) => {
    const response = await axiosClient.put(
        `/hour-bank/${hourBankId}/close?hoursPaid=${hoursPaid}&closedById=${closedById}`
    );
    return response.data;
};

export const reopenBank = async (hourBankId, reopenedById) => {
    const response = await axiosClient.put(
        `/hour-bank/${hourBankId}/reopen?reopenedById=${reopenedById}`
    );
    return response.data;
};