import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getLiquidationPeriods,
    getReportByPeriod,
    getBanksByPeriod,
    generateBanks,
    closeBank,
    reopenBank
} from "../services/hourBankService";
import { AuthContext } from "@/timeTrack/context/AuthContext";

export const useHourBank = () => {
    const { auth } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const currentYear = new Date().getFullYear();

    const [selectedPeriodId, setSelectedPeriodId] = useState(null);

    // 🔵 QUERY: Periodos del año actual
    const periodsQuery = useQuery({
        queryKey: ["liquidation-periods", currentYear],
        queryFn: () => getLiquidationPeriods(currentYear),
        staleTime: 1000 * 60 * 60,
    });

    // 🔵 QUERY: Reporte del periodo seleccionado
    const reportQuery = useQuery({
        queryKey: ["report-by-period", selectedPeriodId],
        queryFn: () => getReportByPeriod(selectedPeriodId),
        enabled: !!selectedPeriodId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    // 🔵 QUERY: Bolsas del periodo — se refresca tras generar, cerrar o reabrir
    const banksQuery = useQuery({
        queryKey: ["banks-by-period", selectedPeriodId],
        queryFn: () => generateBanks(selectedPeriodId), // 👈 genera/actualiza siempre al entrar
        enabled: !!selectedPeriodId,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const closeMutation = useMutation({
        mutationFn: ({ hourBankId, hoursPaid }) =>
            closeBank(hourBankId, hoursPaid, auth.user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["report-by-period", selectedPeriodId] });
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        }
    });

    const reopenMutation = useMutation({
        mutationFn: ({ hourBankId }) =>
            reopenBank(hourBankId, auth.user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["report-by-period", selectedPeriodId] });
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        }
    });

    return {
        periods: periodsQuery.data || [],
        selectedPeriodId,
        setSelectedPeriodId,
        report: reportQuery.data || null,
        banks: banksQuery.data || [],

        isLoading: periodsQuery.isLoading || reportQuery.isLoading || banksQuery.isLoading,
        isClosing: closeMutation.isPending,
        isReopening: reopenMutation.isPending,

        error: periodsQuery.error?.message
            || reportQuery.error?.message
            || banksQuery.error?.message,

        closeBank: (hourBankId, hoursPaid) =>
            closeMutation.mutateAsync({ hourBankId, hoursPaid }),
        reopenBank: (hourBankId) =>
            reopenMutation.mutateAsync({ hourBankId }),
    };
};