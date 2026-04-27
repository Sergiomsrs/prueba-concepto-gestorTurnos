import { axiosClient } from "@/services/axiosClient";

/**
 * Servicio para la gestión de la planificación semanal y sustituciones
 * Basado en WeekPlannerController
 */
export const weekPlannerService = {

    // Inicia el análisis de la semana (POST /api/week/solver/analyze)
    analyze: async (data) => {
        // data debe ser un CreateByGenericDTO (habitualmente contiene fechas o IDs)
        const response = await axiosClient.post(`/week/solver/analyze`, data);
        return response.data; // Retorna WeekAnalysisResponseDto
    },

    // Consulta el estado del motor de Timefold (GET /api/week/solver/status)
    getStatus: async () => {
        const response = await axiosClient.get('/week/solver/status');
        return response.data; // Retorna SolverStatus (e.g., 'SOLVING_ACTIVE', 'NOT_SOLVING')
    },

    // Obtiene la lista de conflictos y soluciones propuestas (GET /api/week/solver/proposal)
    getProposal: async () => {
        const response = await axiosClient.get('/week/solver/proposal');
        return response.data; // Retorna List<WeekConflictDto>
    },

    // Confirma la propuesta actual (POST /api/week/solver/confirm)
    confirm: async () => {
        const response = await axiosClient.post('/week/solver/confirm');
        return response.data;
    },

    // Rechaza toda la propuesta de la semana (DELETE /api/week/solver/reject)
    reject: async () => {
        const response = await axiosClient.delete('/week/solver/reject');
        return response.data;
    },

    // Rechaza un candidato específico para un turno y pide otra opción (POST /api/week/solver/reject-shift/{id})
    rejectShiftCandidate: async ({ shiftId, excludeEmployeeId }) => {
        const response = await axiosClient.post(
            `/week/solver/reject-shift/${shiftId}`,
            null, // No enviamos body
            {
                params: { excludeEmployeeId } // Enviamos el ID a excluir como query param
            }
        );
        return response.data;
    },
};