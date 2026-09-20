export const rosterReducer = (state, action) => {
    switch (action.type) {

        case "SET_ROSTER": {
            const newPayload = action.payload;
            const currentState = state;

            if (!currentState.length) return newPayload;

            return newPayload.map((newDay) => {
                const currentDay = currentState.find((d) => d.id === newDay.id);
                if (!currentDay) return newDay;

                const mergedEmployees = newDay.employees.map((newEmp) => {
                    const currentEmp = currentDay.employees.find((e) => e.id === newEmp.id);
                    if (currentEmp?.isModified) {
                        return { ...currentEmp };
                    }
                    return newEmp;
                });

                return { ...newDay, employees: mergedEmployees };
            });
        }

        case "UPDATE_SHIFT": {
            const { dayIndex, employeeIndex, hourIndex } = action.payload;
            const currentValue = state[dayIndex]?.employees?.[employeeIndex]?.workShift?.[hourIndex];

            // ✅ Si es PTO, no hacer nada
            if (currentValue === "PTO") {
                return state;
            }

            const newState = [...state];
            const day = { ...newState[dayIndex] };
            const employees = [...day.employees];
            const employee = { ...employees[employeeIndex] };
            const workShift = [...employee.workShift];

            // ✅ Lógica actualizada
            if (currentValue === "CONFLICT") {
                workShift[hourIndex] = "PTO";
            } else {
                // Toggle normal entre WORK y Null
                workShift[hourIndex] = currentValue === "WORK" ? "Null" : "WORK";
            }

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
                                if (sIndex >= startIndex && sIndex <= endIndex) {
                                    // ✅ No modificar PTO, convertir CONFLICT a PTO
                                    if (shift === "PTO") {
                                        return shift; // Mantener PTO sin cambios
                                    } else if (shift === "CONFLICT") {
                                        return "PTO";
                                    } else {
                                        return value ? "WORK" : "Null";
                                    }
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
            const currentValue = state[dayIndex]?.employees?.[employeeIndex]?.workShift?.[hourIndex];

            // ✅ Si es PTO, no hacer nada
            if (currentValue === "PTO") {
                return state;
            }

            const newState = [...state];
            const day = { ...newState[dayIndex] };
            const employees = [...day.employees];
            const employee = { ...employees[employeeIndex] };
            const workShift = [...employee.workShift];

            if (currentValue === "CONFLICT") {
                workShift[hourIndex] = "PTO";
            } else {
                workShift[hourIndex] = value ? "WORK" : "Null";
            }

            employee.workShift = workShift;
            employee.isModified = true;
            employees[employeeIndex] = employee;
            day.employees = employees;
            newState[dayIndex] = day;

            return newState;
        }

        case "RESET_MODIFIED": {
            return state.map(day => ({
                ...day,
                employees: day.employees.map(emp => ({
                    ...emp,
                    isModified: false
                }))
            }));
        }

        default:
            return state;
    }
};