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
  if (dayIndex === 0) {
    return data[data.length - 7];
  } else {
    return data[dayIndex - 1];
  }
}

export const calcularshiftDuration = (h) => {
  const shiftDurationInMinutes = h.filter(item => item !== "Null").length * 15;
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
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] !== "Null") {
      return i;
    }
  }
  return -1; // Devuelve -1 si todos los elementos son Null
};

// Formatea de HH:mm:ss a HH:mm
export function formatTime(timeString) {
 
  if (timeString.length === 8) {
      return timeString.substring(0, 5); 
  }
  return timeString; 
}



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


export const formatDate = (day) => {
  const date = new Date(day.id);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
  return `${day.day.charAt(0).toUpperCase() + day.day.slice(1)} ${formattedDate}`;
};

export const formatToDate = (day) => {
  const date = new Date(day.id);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
  return formattedDate;
};









