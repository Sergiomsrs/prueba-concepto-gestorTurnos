import { addMinutes } from "./function";


// Función para dividir el array en bloques basados en el valor "Null"
export const splitIntoBlocks = (arr) => {
  const blocks = [];
  let currentBlock = [];

  arr.forEach(item => {
    if (item !== "Null") {
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

  console.log(minMaxValues[1].min);
};