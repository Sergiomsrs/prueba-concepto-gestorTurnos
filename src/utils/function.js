import { days, employess } from "./data";




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

export const generateDatawithDate = (dates) => {

  return dates.map(day => (
    {
      id: day,
      day: new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(new Date(day)),
      employees: employess.map(emp => ({
        nombre: emp.nombre,
        seccion: emp.seccion,
        horas: Array(62).fill(0),
        total: '00:00'
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

export const calcularTotal = (h) => {
  const totalInMinutes = h.filter(item => item !== 0).length * 15;
  const hoursTotal = Math.floor(totalInMinutes / 60);
  const minutesTotal = totalInMinutes % 60;
  const totalFormatted = `${String(hoursTotal).padStart(2, "0")}:${String(minutesTotal).padStart(2, "0")}`;
  return totalFormatted;
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
    if (array[i] !== 0) {
      return i;
    }
  }
  return -1; // Devuelve -1 si todos los elementos son 0
};



