import { addMinutes } from "./function";


// Función para dividir el array en bloques basados en el valor "Null"
export const splitIntoBlocks = (arr) => {
  const blocks = [];
  let currentBlock = [];

  arr.forEach(item => {
    if (item !== "Null" && item !== "PTO") {
      currentBlock.push(item);
    } else if (currentBlock.length > 0) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
};

// Obtener los valores maximo y minimo de cada bloque
export const findMinMaxOfBlocks = (blocks) => {
  return blocks.map(block => ({
    min: block[0],
    max: block[block.length - 1]
  }));
};

// Obtener el texto a mostrar segun los bloques resultantes
export const getStringBlock = (day, minMaxValues) => {

  switch (true) {

    case minMaxValues.length === 0: { return `Libre`; }
    case minMaxValues.length === 1: { return `De ${minMaxValues[0].min} a ${addMinutes(minMaxValues[0].max, 15)}`; }
    case minMaxValues.length === 2: { return `De ${minMaxValues[0].min} a ${addMinutes(minMaxValues[0].max, 15)} y de ${minMaxValues[1].min} a ${addMinutes(minMaxValues[1].max, 15)}`; }
    case minMaxValues.length >= 3: { return `${day.day} Revisar error`; }
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

