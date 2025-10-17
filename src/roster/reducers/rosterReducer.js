export const rosterReducer = (state, action) => {
    switch (action.type) {

        case "SET_ROSTER":
            return action.payload;

        case "UPDATE_SHIFT": {
            const { dayIndex, employeeIndex, hourIndex } = action.payload;
            const newState = [...state];
            const day = { ...newState[dayIndex] };
            const employees = [...day.employees];
            const employee = { ...employees[employeeIndex] };
            const workShift = [...employee.workShift];

            workShift[hourIndex] = workShift[hourIndex] === "WORK" ? "Null" : "WORK";

            employee.workShift = workShift;
            employee.isModified = true;
            employees[employeeIndex] = employee;
            day.employees = employees;
            newState[dayIndex] = day;

            return newState;
        }

        case "UPDATE_SHIFT_RANGE": {
            const { dayIndex, employeeIndex, startIndex, endIndex, value } = action.payload;

            return state.map((day, dIndex) => {
                if (dIndex !== dayIndex) return day;

                return {
                    ...day,
                    employees: day.employees.map((emp, eIndex) => {
                        if (eIndex !== employeeIndex) return emp;

                        return {
                            ...emp,
                            workShift: emp.workShift.map((shift, sIndex) => {
                                // ✅ Aplicar el valor booleano al rango
                                if (sIndex >= startIndex && sIndex <= endIndex) {
                                    return value ? "WORK" : "Null"; // ✅ Convertir boolean a string
                                }
                                return shift;
                            }),
                            isModified: true
                        };
                    })
                };
            });
        }

        case "UPDATE_SHIFT_FIXED": {
            const { dayIndex, employeeIndex, hourIndex, value } = action.payload;
            const newState = [...state];
            const day = { ...newState[dayIndex] };
            const employees = [...day.employees];
            const employee = { ...employees[employeeIndex] };
            const workShift = [...employee.workShift];

            workShift[hourIndex] = value ? "WORK" : "Null";
            employee.workShift = workShift;
            employee.isModified = true;
            employees[employeeIndex] = employee;
            day.employees = employees;
            newState[dayIndex] = day;

            return newState;
        }

        default:
            return state;
    }
};
