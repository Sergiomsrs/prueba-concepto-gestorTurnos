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


