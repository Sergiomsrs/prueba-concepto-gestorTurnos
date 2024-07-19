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


export const calcularTotal = (h) => {
    const totalInMinutes = h.filter(item => item !== 0).length * 15;
    const hoursTotal = Math.floor(totalInMinutes / 60);
    const minutesTotal = totalInMinutes % 60;
    const totalFormatted = `${String(hoursTotal).padStart(2, "0")}:${String(minutesTotal).padStart(2, "0")}`;
    return totalFormatted;
  };


export const addMinutes = (time, minsToAdd)=> {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, hours, minutes);
  date.setMinutes(date.getMinutes() + minsToAdd);
  const newHours = date.getHours().toString().padStart(2, '0');
  const newMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${newHours}:${newMinutes}`;
}



