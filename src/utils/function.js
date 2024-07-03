import { days, employess } from "./data";



export const arayToHour = (array) => {
    const countGreaterThanZero = array.filter(value => value > 0).length;
    const totalInMinutes = countGreaterThanZero * 15;
    const hours = Math.floor(totalInMinutes / 60);
    const minutes = totalInMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export const generateData = () => {
    return days.map(day => ({
        id: day.id,
        day: day.dia,
        employees: employess.map(emp => ({
            nombre: emp.nombre,
            seccion: emp.seccion,
            horas: Array(78).fill(0),
            total: '00:00'
        }))
    }));
};





