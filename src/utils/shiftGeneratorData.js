

export const generateData = (cicle, emp) => {
    return days.map(day => ({
        id: day.id,
        cicle: cicle,
        day: day.dia,
        employees: emp.map(emp => ({
            id: emp.id,
            name: emp.name,
            lastName: '',
            teamWork: emp.teamWork,
            wwh: emp.wwh,
            workShift: Array(62).fill("Null"),
            shiftDuration: '00:00'
        }))
    }));
};

export const generateShiftData = (dt, cycle) => {
    const shiftData = [];

    dt.slice(1).forEach(day => {
        day.employees.forEach(employee => {
            shiftData.push({
                shiftRoleId: employee.id,
                cycle: cycle,
                hours: employee.workShift,
                date: day.id,
                shiftDuration: employee.shiftDuration
            });
        });
    });
    return shiftData;
};

export const days = [
    { id: "0", dia: "Domingo" },
    { id: "1", dia: "Lunes" },
    { id: "2", dia: "Martes" },
    { id: "3", dia: "Miercoles" },
    { id: "4", dia: "Jueves" },
    { id: "5", dia: "Viernes" },
    { id: "6", dia: "Sabado" },
    { id: "7", dia: "Domingo" }

];



/* export const days = [
    { id: "01-01-2024", dia: "Lunes" },
    { id: "02-01-2024", dia: "Martes" },
    { id: "03-01-2024", dia: "Miercoles" },
    { id: "04-01-2024", dia: "Jueves" },
    { id: "05-01-2024", dia: "Viernes" },
    { id: "06-01-2024", dia: "Sabado" },
    { id: "07-01-2024", dia: "Domingo" }

]; */
export const employess = [
    { id: 1, name: 'Turno 1', teamWork: 'Sec1', wwh: 18 },
    { id: 2, name: 'Turno 2', teamWork: 'Sec1', wwh: 18 },
    { id: 3, name: 'Turno 3', teamWork: 'Sec1', wwh: 18 },
    { id: 4, name: 'Turno 4', teamWork: 'Sec1', wwh: 18 },
    { id: 5, name: 'Turno 5', teamWork: 'Sec2', wwh: 18 },
    { id: 6, name: 'Turno 6', teamWork: 'Sec2', wwh: 18 },
    { id: 7, name: 'Turno 7', teamWork: 'Sec2', wwh: 18 },
    { id: 8, name: 'Turno 8', teamWork: 'Sec2', wwh: 18 },
];
