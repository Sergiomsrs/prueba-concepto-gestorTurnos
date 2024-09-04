import { addMinutes } from "./function";


// Función para dividir el array en bloques basados en los ceros
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

// Función para encontrar el mínimo y máximo de cada bloque
export const findMinMaxOfBlocks = (blocks) => {
  return blocks.map(block => ({
    min: block[0],
    max: block[block.length - 1]
  }));
};


export const getStringBlock = (day, minMaxValues) => {

  switch (true) {

    case minMaxValues.length === 0: { return `${day.id}  --> ${day.day} Libre`; }
    case minMaxValues.length === 1: { return `${day.id}  --> ${day.day} de:  ${minMaxValues[0].min} a ${addMinutes(minMaxValues[0].max, 15)}`; }
    case minMaxValues.length === 2: { return `${day.id}  --> ${day.day} de:  ${minMaxValues[0].min} a ${addMinutes(minMaxValues[0].max, 15)} y de ${minMaxValues[1].min} a ${addMinutes(minMaxValues[1].max, 15)}`; }
    case minMaxValues.length >= 3: { return `${day.id}  --> ${day.day} Revisar error`;}
  }

  console.log(minMaxValues[1].min);



};