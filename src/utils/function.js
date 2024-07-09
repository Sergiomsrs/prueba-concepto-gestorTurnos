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
            horas: Array(62).fill(0),
            total: '00:00'
        }))
    }));
};



// Hacer horarios entrada y salida
//const miercoles = datamock.find(item => item.day === 'Miercoles');

// Luego encontramos el objeto del empleado2 dentro del array employees del miércoles
//const empleado2 = miercoles.employees.find(empleado => empleado.nombre === 'Empleado2');

// Finalmente, extraemos el array de horas del empleado2
//const horasEmpleado2Miercoles = empleado2.horas;

// Ahora tienes el array de horas del empleado2 del miércoles en la variable horasEmpleado2Miercoles
//console.log(horasEmpleado2Miercoles);  // Est
/*
const convertirHoraADate = (horasArray) => {
    return horasArray.map(hora => {
        const [horaStr, minutosStr] = hora.split(":");
        const dateObj = new Date();
        dateObj.setHours(parseInt(horaStr, 10));
        dateObj.setMinutes(parseInt(minutosStr, 10));
        return dateObj;
    });
};
*/


