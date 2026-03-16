

// Utilidad para convertir índice → hora

export const getTimeFromIndex = (index) => {
  const startHour = 7; // hora de inicio
  const interval = 15; // minutos por bloque
  const totalMinutes = startHour * 60 + index * interval;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};