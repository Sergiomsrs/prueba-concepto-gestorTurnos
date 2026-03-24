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

export function formatTime(timeString) {
  // Formatea de HH:mm:ss a HH:mm
  // Verifica si timeString es una cadena de texto y tiene una longitud válida
  if (typeof timeString === 'string' && timeString.length === 8) {
    return timeString.substring(0, 5); // Formatea el tiempo si es válido
  }
  return timeString || "N/A"; // Devuelve timeString o un valor predeterminado si es undefined o null
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
  switch (teamWork?.toLowerCase()) {
    case 'blue': return '#2e5882';
    case 'purple': return '#8a40a3';
    case 'amarillo': return '#f6cb41';
    case 'green': return '#2d7d5a';
    case 'red': return '#c0392b';
    case 'black': return '#3d3d3d';
    case 'naranja': return '#d4681e';
    case 'rosa': return '#c2527a';
    case 'turquesa': return '#1a7f8e';
    case 'lima': return '#5a8a1e';
    default: return '#64748b';
  }
};

export const getTotalShiftDuration = (employeeName, data) => {
  // Función para calcular la duración total en formato decimal
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









