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
  const shiftDurationInMinutes = h.filter(item => item !== "Null" && item !== "PTO").length * 15;
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
  if (array == null) return -1;
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


export const formatDate = (day, hol, daysOfWeek = []) => {
  const date = new Date(day.id);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
  const isHoliday = hol.includes(day.id);

  // Si day.day existe, lo capitaliza; si no, usa el nombre del array daysOfWeek según el id
  let dayName;
  if (day.day) {
    dayName = day.day.charAt(0).toUpperCase() + day.day.slice(1);
  } else if (daysOfWeek.length && typeof day.id === "number") {
    dayName = daysOfWeek[day.id];
  } else {
    dayName = ""; // fallback vacío si no hay nada
  }

  return `${dayName} ${formattedDate} ${isHoliday ? '🎉' : ''}`;
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

export const selectColor = (teamWork) => {
  let selectColor;

  switch (teamWork?.toLowerCase()) {
    case 'red':
      selectColor = 'bg-gradient-to-b from-red-400 to-red-600';
      break;
    case 'black':
      selectColor = 'bg-gradient-to-b from-gray-700 to-gray-900';
      break;
    case 'blue':
      selectColor = 'bg-gradient-to-b from-blue-400 to-blue-600';
      break;
    case 'green':
      selectColor = 'bg-gradient-to-b from-emerald-400 to-emerald-600';
      break;
    case 'amarillo':
      selectColor = 'bg-gradient-to-b from-yellow-300 to-yellow-500';
      break;
    case 'purple':
      selectColor = 'bg-gradient-to-b from-purple-400 to-purple-600';
      break;
    case 'naranja':
      selectColor = 'bg-gradient-to-b from-orange-400 to-orange-600';
      break;
    case 'rosa':
      selectColor = 'bg-gradient-to-b from-pink-400 to-pink-600';
      break;
    case 'turquesa':
      selectColor = 'bg-gradient-to-b from-teal-400 to-teal-600';
      break;
    case 'lima':
      selectColor = 'bg-gradient-to-b from-lime-400 to-lime-600';
      break;
    default:
      selectColor = 'bg-gradient-to-b from-slate-300 to-slate-400';
      break;
  }

  return selectColor;
};



// Función para calcular la duración total en formato decimal
export const getTotalShiftDuration = (employeeName, data) => {
  let totalMinutes = 0;

  // Iteramos sobre los días para obtener la duración de cada turno del empleado
  data.forEach(day => {
    const employee = day.employees.find(emp => emp.name === employeeName);
    if (employee && employee.shiftDuration) {
      const [hours, minutes] = employee.shiftDuration.split(":").map(Number);
      totalMinutes += hours * 60 + minutes; // Convertimos todo a minutos
    }
  });

  const totalHoursDecimal = totalMinutes / 60;
  return totalHoursDecimal.toFixed(2);
};


export const getDayName = (num) => {
  const days = [
    "Lunes",     // 0
    "Martes",    // 1
    "Miércoles", // 2
    "Jueves",    // 3
    "Viernes",   // 4
    "Sábado",    // 5
    "Domingo"    // 6
  ];

  return days[num] || "Día inválido";
}









