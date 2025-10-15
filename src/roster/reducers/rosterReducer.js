export const rosterReducer = (state, action) => {
    switch (action.type) {
        case "SET_ROSTER":
            return action.payload.map(day => ({
                ...day,
                employees: day.employees.map(emp => ({
                    ...emp,
                    isModified: false
                }))
            }));

        case "UPDATE_SHIFT": {
            const { dayIndex, employeeIndex, hourIndex } = action.payload;
            const newState = structuredClone(state);
            const day = newState[dayIndex];

            // Seguridad: si el día o el empleado no existen aún, devuelve el estado actual
            if (!day || !day.employees[employeeIndex]) return state;

            const employee = day.employees[employeeIndex];

            // Seguridad: si el workShift no existe o el índice está fuera de rango
            if (!employee.workShift || hourIndex >= employee.workShift.length) return state;

            const currentValue = employee.workShift[hourIndex];
            let newValue;

            if (currentValue === null) newValue = "WORK";
            else if (currentValue === "WORK" || currentValue === "CONFLICT") newValue = "Null";
            else newValue = "WORK"; // fallback

            employee.workShift[hourIndex] = newValue;
            employee.isModified = true;

            return newState;
        }


        default:
            return state;
    }
}
