export const generateSplitWorkShift = (ranges) => {
    const arrayLength = 62; // Representa las horas de 07:00 a 22:30
    const startHour = 7; // Hora de inicio del array
    const interval = 15; // Intervalo en minutos
    const workShift = Array(arrayLength).fill("Null"); // Inicializa con "Null"
  
    // Recorre cada rango y actualiza el array
    ranges.forEach(([start, end]) => {
      // Convertir horas de inicio y fin a índices
      const startIndex = ((start.hour * 60 + start.minute) - (startHour * 60)) / interval;
      const endIndex = ((end.hour * 60 + end.minute) - (startHour * 60)) / interval;
  
      // Llenar el array con las horas correspondientes
      for (let i = startIndex; i <= endIndex; i++) {
        const totalMinutes = (startHour * 60) + i * interval;
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        workShift[i] = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      }
    });
  
    return workShift;
  };
  
  // Ejemplo de uso
  /*const workShiftArray = generateSplitWorkShift([
    [{ hour: 10, minute: 0 }, { hour: 13, minute: 45 }], // Primer bloque
    [{ hour: 17, minute: 0 }, { hour: 20, minute: 45 }]  // Segundo bloque
  ]);
  
  console.log(workShiftArray);
  */

  export const getTimeFromIndex = (index) => {
  const startHour = 7; // hora de inicio
  const interval = 15; // minutos por bloque

  // calcular minutos totales desde la medianoche
  const totalMinutes = startHour * 60 + index * interval;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // formatear con dos dígitos
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

/* console.log(getTimeFromIndex(0));  // "07:00" */

  export const getIndexFromTime = (timeStr) => {
  const startHour = 7; // hora de inicio
  const interval = 15; // minutos por bloque

  const [hours, minutes] = timeStr.split(":").map(Number);

  // minutos totales desde la hora de inicio
  const totalMinutes = (hours * 60 + minutes) - (startHour * 60);

  // calcular índice
  const index = Math.floor(totalMinutes / interval);

  // asegurar que el índice está dentro del array
  return index < 0 ? 0 : index;
};

/* console.log(getIndexFromTime("07:00"));  */
