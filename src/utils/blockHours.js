import { addMinutes } from "./function";
import { getTimeFromIndex } from "./timeManager";


// 2. Detectar bloques "WORK" por índices
export const splitIntoBlocksByIndex = (arr) => {
  const blocks = [];
  let startIndex = null;
  let lastValidIndex = null;

  arr.forEach((item, i) => {
    if (item === "WORK") {
      if (startIndex === null) startIndex = i;
      lastValidIndex = i;
    } else {
      if (startIndex !== null && lastValidIndex !== null) {
        blocks.push([startIndex, lastValidIndex]);
      }
      startIndex = null;
      lastValidIndex = null;
    }
  });

  if (startIndex !== null && lastValidIndex !== null) {
    blocks.push([startIndex, lastValidIndex]);
  }

  return blocks;
};

// 3. Convertir bloques de índices → horas
export const convertBlocksToTimes = (blocks) => {
  return blocks.map(([start, end]) => ({
    min: getTimeFromIndex(start),
    max: getTimeFromIndex(end + 1) // sumamos +15 min al final
  }));
};

// 4. Texto legible
export const getStringBlock = (day, minMaxValues) => {
  switch (true) {
    case minMaxValues.length === 0:
      return `Libre`;
    case minMaxValues.length === 1:
      return `De ${minMaxValues[0].min} a ${minMaxValues[0].max}`;
    case minMaxValues.length === 2:
      return `De ${minMaxValues[0].min} a ${minMaxValues[0].max} y de ${minMaxValues[1].min} a ${minMaxValues[1].max}`;
    case minMaxValues.length >= 3:
      return `${day.day} Revisar error`;
    default:
      return "";
  }
};



const generateWorkShiftArray = (startTime, endTime, interval = 15, startHour = 7) => {
  const workShift = Array(62).fill("Null"); // Array de 62 posiciones para 07:00 a 22:30
  const [startHourInput, startMinutes] = startTime.split(":").map(Number);
  const [endHourInput, endMinutes] = endTime.split(":").map(Number);

  // Calcular índices ajustados según el rango de 07:00 a 22:30
  const startIndex = ((startHourInput * 60 + startMinutes) - (startHour * 60)) / interval;
  const endIndex = ((endHourInput * 60 + endMinutes) - (startHour * 60)) / interval;

  // Llenar el array con las horas correspondientes
  for (let i = startIndex; i <= endIndex; i++) {
    const currentMinutes = (i * interval) + (startHour * 60);
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    workShift[i] = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return workShift;
};
/*
// Ejemplo de uso
const startTime = "10:00";
const endTime = "16:00";
const result = generateWorkShiftArray(startTime, endTime);
console.log(result);
*/

export const generateWorkShiftPto = (startTime, endTime, interval = 15, startHour = 7) => {
  const workShift = Array(62).fill("Null"); // Array de 62 posiciones para 07:00 a 22:30
  const [startHourInput, startMinutes] = startTime.split(":").map(Number);
  const [endHourInput, endMinutes] = endTime.split(":").map(Number);

  // Calcular índices ajustados según el rango de 07:00 a 22:30
  const startIndex = Math.round(((startHourInput * 60 + startMinutes) - (startHour * 60)) / interval);
  const endIndex = Math.round(((endHourInput * 60 + endMinutes) - (startHour * 60)) / interval);

  // Llenar el array con "PTO" en lugar de las horas
  for (let i = startIndex; i <= endIndex - 1; i++) {
    workShift[i] = "PTO";
  }

  return workShift;
};

