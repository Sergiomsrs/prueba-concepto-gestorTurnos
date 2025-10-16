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

            // Toggle single cell
            const currentValue = workShift[hourIndex];
            let newValue;
            if (currentValue === "Null") newValue = "WORK";
            else if (currentValue === "WORK" || currentValue === "CONFLICT") newValue = "Null";
            else newValue = "WORK";

            workShift[hourIndex] = newValue;

            employee.workShift = workShift;
            employee.isModified = true;
            employees[employeeIndex] = employee;
            day.employees = employees;
            newState[dayIndex] = day;

            return newState;
        }

        case "UPDATE_SHIFT_RANGE": {
            const { dayIndex, employeeIndex, startIndex, endIndex, value } = action.payload;

            const newState = [...state];
            const day = { ...newState[dayIndex] };
            const employees = [...day.employees];
            const employee = { ...employees[employeeIndex] };
            const workShift = [...employee.workShift];

            // Update range
            for (let i = startIndex; i <= endIndex; i++) {
                workShift[i] = value ? "WORK" : "Null";
            }

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
