import { days, employess } from "./data";


export const generateData = () => {
  return days.map(day => ({
    id: day.id,
    day: day.dia,
    employees: employess.map(emp => ({
      name: emp.name,
      teamWork: emp.teamWork,
      workShift: Array(62).fill("Null"),
      shiftDuration: '00:00'
    }))
  }));
};

export const getDatesInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  // Validar las fechas
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Fechas inválidas:", startDate, endDate);
    return [];
  }

  // Iterar desde la fecha de inicio hasta la de fin
  for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
    dates.push(new Date(currentDate).toISOString().split('T')[0]); // Formato YYYY-MM-DD
  }

  return dates;
};

export const generatePtoWithDate = (id, dates) => {
  return dates.map(date => ({
    employeeId: id,
    hours: Array(62).fill("PTO"),
    date: date,
    shiftDuration: '00:00'
  }));
};

export const generatePtoNullWithDate = (id, dates) => {
  return dates.map(date => ({
    employeeId: id,
    hours: Array(62).fill("Null"),
    date: date,
    shiftDuration: '00:00'
  }));
};


export const generateDatawithDate = (dates) => {

  return dates.map(day => (
    {
      id: day,
      day: new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(day)),
      employees: employess.map(emp => ({
        name: emp.name,
        teamWork: emp.teamWork,
        workShift: Array(62).fill("Null"),
        shiftDuration: '00:00'
      }))
    }));
};


export const generateDays = (date) => {

  const date2 = new Date(date);
  const date2MinusOneDay = new Date(date2);
  date2MinusOneDay.setDate(date2.getDate() - 1);
  const days = [date2MinusOneDay];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(date2);
    newDate.setDate(date2.getDate() + i);
    days.push(newDate.toISOString().split('T')[0]);
  }
  return days;
}

export const obtenerPreviousDay = (dayIndex, data) => {
    return data[dayIndex - 1];
}

export const calcularshiftDuration = (h) => {
  const shiftDurationInMinutes = h.filter(item => item !== "Null" && item !== "PTO" ).length * 15;
  const hoursshiftDuration = Math.floor(shiftDurationInMinutes / 60);
  const minutesshiftDuration = shiftDurationInMinutes % 60;
  const shiftDurationFormatted = `${String(hoursshiftDuration).padStart(2, "0")}:${String(minutesshiftDuration).padStart(2, "0")}`;
  return shiftDurationFormatted;
};


export const addMinutes = (time, minsToAdd) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, hours, minutes);
  date.setMinutes(date.getMinutes() + minsToAdd);
  const newHours = date.getHours().toString().padStart(2, '0');
  const newMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${newHours}:${newMinutes}`;
}

export const getHighestNonZeroIndex = (array) => {
  if(array == null) return -1;
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] !== "Null" && array[i] !== "PTO") {
      return i;
    }
  }
  return -1; // Devuelve -1 si todos los elementos son Null
};

// Formatea de HH:mm:ss a HH:mm
export function formatTime(timeString) {
  // Verifica si timeString es una cadena de texto y tiene una longitud válida
  if (typeof timeString === 'string' && timeString.length === 8) {
    return timeString.substring(0, 5); // Formatea el tiempo si es válido
  }
  return timeString || "N/A"; // Devuelve timeString o un valor predeterminado si es undefined o null
}


export const generatePtoShift = (id, startDate, endDate) => {
  const shifts = [];

};




export const generateShiftData = (dt) => {
  const shiftData = [];

  dt.slice(1).forEach(day => {
    day.employees.forEach(employee => {
      shiftData.push({
        employeeId: employee.id,
        hours: employee.workShift,
        date: day.id,
        shiftDuration: employee.shiftDuration
      });
    });
  });
  return shiftData;
};


export const formatDate = (day, hol) => {
  const date = new Date(day.id);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
  const isHoliday = hol.includes(day.id);
  
  console.log(day.id);
  console.log(hol);
  console.log(isHoliday);
  return `${day.day.charAt(0).toUpperCase() + day.day.slice(1)} ${formattedDate} ${isHoliday ? '🎉' : ''}`;

};

export const formatToDate = (day) => {
  const date = new Date(day.id);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
  return formattedDate;
};


export const uniqueEmployeeName = (data) => {
    // Creamos un Set para almacenar nombres únicos de empleados
    const employeeNamesSet = new Set();

    // Iteramos sobre cada día en el array data
    data.forEach(day => {
      // Iteramos sobre cada empleado en el día actual
      day.employees.forEach(employee => {
        // Agregamos el nombre del empleado al Set
        employeeNamesSet.add(employee.name);
      });
    });
  
    // Convertimos el Set a un array, si necesitas el resultado en formato array
    const uniqueEmployeeNames = Array.from(employeeNamesSet);

    return uniqueEmployeeNames;
}









