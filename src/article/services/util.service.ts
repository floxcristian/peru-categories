/**
 * Formatear el tiempo total en segundos a un formato legible.
 * @param seconds - segundos
 * @returns
 */
export const formatTotalTime = (seconds: number): string => {
  // Cálculo de horas, minutos y segundos
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Añadir ceros a la izquierda si es necesario
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = secs.toString().padStart(2, '0');

  // Formatear como hh:mm:ss
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};
