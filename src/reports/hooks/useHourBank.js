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
    const [closingBankId, setClosingBankId] = useState(null);
    const [reopeningBankId, setReopeningBankId] = useState(null);

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
        onMutate: async ({ hourBankId, hoursPaid }) => {
            setClosingBankId(hourBankId);
            // Cancelar queries en tránsito para evitar race conditions
            await queryClient.cancelQueries({ queryKey: ["banks-by-period", selectedPeriodId] });

            // Guardar datos anteriores para revertir si hay error
            const previousBanks = queryClient.getQueryData(["banks-by-period", selectedPeriodId]);

            // Actualizar optimistamente el estado local
            queryClient.setQueryData(["banks-by-period", selectedPeriodId], (old) => {
                if (!old) return old;
                return old.map(bank =>
                    bank.id === hourBankId
                        ? { ...bank, status: "CLOSED", hoursPaid }
                        : bank
                );
            });

            return { previousBanks };
        },
        onSuccess: () => {
            setClosingBankId(null);
            queryClient.invalidateQueries({ queryKey: ["report-by-period", selectedPeriodId] });
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        },
        onError: (err, variables, context) => {
            setClosingBankId(null);
            // Revertir a los datos anteriores si hay error
            if (context?.previousBanks) {
                queryClient.setQueryData(["banks-by-period", selectedPeriodId], context.previousBanks);
            }
        }
    });

    const reopenMutation = useMutation({
        mutationFn: ({ hourBankId }) =>
            reopenBank(hourBankId, auth.user.id),
        onMutate: async ({ hourBankId }) => {
            setReopeningBankId(hourBankId);
            // Cancelar queries en tránsito para evitar race conditions
            await queryClient.cancelQueries({ queryKey: ["banks-by-period", selectedPeriodId] });

            // Guardar datos anteriores para revertir si hay error
            const previousBanks = queryClient.getQueryData(["banks-by-period", selectedPeriodId]);

            // Actualizar optimistamente el estado local
            queryClient.setQueryData(["banks-by-period", selectedPeriodId], (old) => {
                if (!old) return old;
                return old.map(bank =>
                    bank.id === hourBankId
                        ? { ...bank, status: "REOPENED" }
                        : bank
                );
            });

            return { previousBanks };
        },
        onSuccess: () => {
            setReopeningBankId(null);
            queryClient.invalidateQueries({ queryKey: ["report-by-period", selectedPeriodId] });
            queryClient.invalidateQueries({ queryKey: ["banks-by-period", selectedPeriodId] });
        },
        onError: (err, variables, context) => {
            setReopeningBankId(null);
            // Revertir a los datos anteriores si hay error
            if (context?.previousBanks) {
                queryClient.setQueryData(["banks-by-period", selectedPeriodId], context.previousBanks);
            }
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
        closingBankId,
        reopeningBankId,

        error: periodsQuery.error?.message
            || reportQuery.error?.message
            || banksQuery.error?.message,

        closeBank: (hourBankId, hoursPaid) =>
            closeMutation.mutateAsync({ hourBankId, hoursPaid }),
        reopenBank: (hourBankId) =>
            reopenMutation.mutateAsync({ hourBankId }),
    };
};