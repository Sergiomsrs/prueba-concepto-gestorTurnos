import { axiosClient } from "@/services/axiosClient";

export const weekPlannerService = {
    /**
     * Analiza una semana y genera una propuesta de horarios
     * @param {Object} dto - CreateByGenericDTO con la información de la semana
     * @returns {Promise<WeekAnalysisResponseDto>} Análisis y propuesta de horarios
     */
    analyze: async (dto) => {
        const response = await axiosClient.post(`/week/solver/analyze`, dto);
        return response.data;
    },

    /**
     * Obtiene el estado actual del solver
     * @returns {Promise<SolverStatus>} Estado del solver (IDLE, SOLVING, SOLVING_ACTIVE)
     */
    status: async () => {
        const response = await axiosClient.get('/week/solver/status');
        return response.data;
    },

    /**
     * Obtiene la propuesta actual de conflictos de horarios
     * @returns {Promise<Array<WeekConflictDto>>} Lista de conflictos detectados
     */
    getProposal: async () => {
        const response = await axiosClient.get('/week/solver/proposal');
        return response.data;
    },

    /**
     * Confirma la propuesta actual de horarios
     * @returns {Promise<void>}
     */
    confirm: async () => {
        const response = await axiosClient.post('/week/solver/confirm');
        return response.data;
    },

    /**
     * Rechaza la propuesta actual de horarios
     * @returns {Promise<void>}
     */
    reject: async () => {
        const response = await axiosClient.delete('/week/solver/reject');
        return response.data;
    },

    /**
     * Rechaza un candidato específico para un turno
     * @param {Long} shiftId - ID del turno
     * @param {Long} excludeEmployeeId - ID del empleado a excluir de candidatos
     * @returns {Promise<void>}
     */
    rejectShiftCandidate: async ({ shiftId, excludeEmployeeId }) => {
        const response = await axiosClient.post(
            `/week/solver/reject-shift/${shiftId}`,
            null,
            { params: { excludeEmployeeId } }
        );
        return response.data;
    },
};
