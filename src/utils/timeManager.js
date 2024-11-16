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
  const workShiftArray = generateSplitWorkShift([
    [{ hour: 10, minute: 0 }, { hour: 13, minute: 45 }], // Primer bloque
    [{ hour: 17, minute: 0 }, { hour: 20, minute: 45 }]  // Segundo bloque
  ]);
  
  console.log(workShiftArray);
  