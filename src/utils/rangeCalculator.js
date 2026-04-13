/**
 * Cálculos eficientes para mapear rango de horas visible a índices del array
 * Se usa en toda la app para conversiones hora → índice sin crear objetos nuevos
 */

const QUARTER_HOUR_SLOTS = 4; // 60min / 15min = 4 slots por hora

/**
 * Convierte una hora decimal (7.5) o entera (7) a índice del array
 * @param {number} hour - Hora decimal (0-24)
 * @returns {number} Índice en el array workShift
 */
export const hourToIndex = (hour) => Math.floor(hour * QUARTER_HOUR_SLOTS);

/**
 * Convierte un índice del array a hora decimal
 * @param {number} index - Índice en workShift
 * @returns {number} Hora decimal
 */
export const indexToHour = (index) => index / QUARTER_HOUR_SLOTS;

/**
 * Calcula el rango visible completo en una sola operación
 * ⚠️ CRÍTICO: Este objeto debe ser memoizado en el componente que lo usa
 * @param {number} startHour - Hora de inicio (ej: 7)
 * @param {number} endHour - Hora de fin (ej: 22.5)
 * @returns {object} { startIndex, endIndex, visibleSlots }
 */
export const getVisibleRange = (startHour, endHour) => {
    const startIndex = hourToIndex(startHour);
    const endIndex = hourToIndex(endHour);
    const visibleSlots = endIndex - startIndex;

    return {
        startIndex,
        endIndex,
        visibleSlots,
    };
};

/**
 * Convierte un índice relativo (dentro del slice visible) a índice absoluto
 * Útil para manejar @click/@change handlers
 * @param {number} relativeIndex - Índice dentro del array visible
 * @param {number} startIndex - startIndex del rango (de getVisibleRange)
 * @returns {number} Índice absoluto en workShift[0-95]
 */
export const relativeToAbsoluteIndex = (relativeIndex, startIndex) => {
    return startIndex + relativeIndex;
};

/**
 * Pre-configura presets comunes para no recalcularlos
 * Se incluyen en AppProvider una sola vez
 * @returns {array} Presets de rango horario
 */
export const HOUR_RANGE_PRESETS = [
    {
        id: 'original',
        label: '7:00 - 22:30',
        startHour: 7,
        endHour: 22.5,
        description: 'Rango original (62 slots)',
    },
    {
        id: 'fullDay',
        label: '00:00 - 24:00',
        startHour: 0,
        endHour: 24,
        description: 'Día completo (96 slots)',
    },
    {
        id: 'compact',
        label: '10:00 - 22:00',
        startHour: 10,
        endHour: 22,
        description: 'Compacto (48 slots)',
    },
    {
        id: 'logistics',
        label: '06:00 - 16:00',
        startHour: 6,
        endHour: 16,
        description: 'Compacto (48 slots)',
    },
    {
        id: 'nightShift',
        label: '16:00 - 24:00',
        startHour: 16,
        endHour: 24,
        description: 'Turno de noche (16 slots)',
    },
];

/**
 * Valida que un rango sea válido (no es necesario llamar siempre)
 * @param {number} startHour
 * @param {number} endHour
 * @returns {boolean}
 */
export const isValidRange = (startHour, endHour) => {
    return (
        typeof startHour === 'number' &&
        typeof endHour === 'number' &&
        startHour >= 0 &&
        endHour <= 24 &&
        startHour < endHour
    );
};
