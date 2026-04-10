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
        queryFn: async () => {
            const data = await getLiquidationPeriods(currentYear);
            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 hora — los periodos no cambian
    });

    // 🔵 QUERY: Reporte del periodo seleccionado
    const reportQuery = useQuery({
        queryKey: ["report-by-period", selectedPeriodId],
        queryFn: async () => {
            const data = await getReportByPeriod(selectedPeriodId);
            return data;
        },
        enabled: !!selectedPeriodId,
        staleTime: 1000 * 60 * 5,
    });

    // 🔵 QUERY: Bolsas del periodo seleccionado
    const banksQuery = useQuery({
        queryKey: ["banks-by-period", selectedPeriodId],
        queryFn: async () => {
            const data = await getBanksByPeriod(selectedPeriodId);
            return data;
        },
        enabled: !!selectedPeriodId,
        staleTime: 1000 * 60 * 5,
    });

    // 🔴 MUTATION: Generar bolsas
    const generateMutation = useMutation({
        mutationFn: () => generateBanks(selectedPeriodId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        }
    });

    // 🔴 MUTATION: Cerrar bolsa
    const closeMutation = useMutation({
        mutationFn: ({ hourBankId, hoursPaid, closedById }) =>
            closeBank(hourBankId, hoursPaid, closedById),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        }
    });

    // 🔴 MUTATION: Reabrir bolsa
    const reopenMutation = useMutation({
        mutationFn: ({ hourBankId, reopenedById }) =>
            reopenBank(hourBankId, reopenedById),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        }
    });

    return {
        // Periodos
        periods: periodsQuery.data || [],
        selectedPeriodId,
        setSelectedPeriodId,

        // Reporte
        report: reportQuery.data || null,

        // Bolsas
        banks: banksQuery.data || [],

        // Estados de carga
        isLoading: periodsQuery.isLoading || reportQuery.isLoading || banksQuery.isLoading,
        isGenerating: generateMutation.isPending,
        isClosing: closeMutation.isPending,
        isReopening: reopenMutation.isPending,

        // Errores
        error: periodsQuery.error?.message
            || reportQuery.error?.message
            || banksQuery.error?.message,

        // Acciones
        generateBanks: generateMutation.mutateAsync,
        closeBank: (hourBankId, hoursPaid) =>
            closeMutation.mutateAsync({ hourBankId, hoursPaid, closedById: auth.user.id }),
        reopenBank: (hourBankId) =>
            reopenMutation.mutateAsync({ hourBankId, reopenedById: auth.user.id }),
    };
};