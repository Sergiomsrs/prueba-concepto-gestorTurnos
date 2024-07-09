import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const EmployeeWeek = () => {
  const { data } = useContext(AppContext);
  const empleado = "Empleado1";

  // Función para encontrar el valor más alto y más bajo en un array de horas
  function encontrarMinMaxHoras(horas) {
    // Filtrar las horas válidas (distintas de "00:00")
    let horasValidas = horas.filter(hora => hora !== 0).map(hora => {
      // Convertir cada hora a minutos para facilitar la comparación
      let [horas, minutos] = hora.split(':');
      return parseInt(horas) * 60 + parseInt(minutos);
    });

    // Encontrar el mínimo y el máximo en minutos
    let minutoMinimo = Math.min(...horasValidas);
    let minutoMaximo = Math.max(...horasValidas);
    minutoMaximo += 15;

    // Convertir minutos nuevamente a formato "hh:mm"
    let horaMinima = `${Math.floor(minutoMinimo / 60).toString().padStart(2, '0')}:${(minutoMinimo % 60).toString().padStart(2, '0')}`;
    let horaMaxima = `${Math.floor(minutoMaximo / 60).toString().padStart(2, '0')}:${(minutoMaximo % 60).toString().padStart(2, '0')}`;

    return {
      minimo: horaMinima,
      maximo: horaMaxima
    };
  }

  // Filtrar y mapear los datos para obtener solo las horas de Empleado1
  const empleado1Data = data.map(day => ({
    id: day.id,
    day: day.day,
    horas: day.employees.find(emp => emp.nombre === empleado).horas
  }));

  return (
    <div>
      {empleado1Data.map((day, index) => {
        const { horas } = day;
        const { minimo, maximo } = encontrarMinMaxHoras(horas);

        return (
          <div key={index}>
            <h1>{`${day.day} de ${minimo} a ${maximo}` }</h1>
           
          </div>
        );
      })}
    </div>
  );
};
