import { useState } from "react";

const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];

export const HorizontalBar = ({ username, hours, onHourChange }) => {
    const [data, setData] = useState({
      nombre: username,
      horas: hours || Array(10).fill(0),
      total: '00:00',
    });

  
    const handleChange = (index, event) => {
      const newHoras = [...data.horas];
      newHoras[index] = Number(event.target.value);
  
      const countGreaterThanZero = newHoras.filter(value => value > 0).length;
      const totalInMinutes = countGreaterThanZero * 15;
      const hours = Math.floor(totalInMinutes / 60);
      const minutes = totalInMinutes % 60;
      const totalFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
      setData({ ...data, horas: newHoras, total: totalFormatted });
  
      // Llamamos a la función de devolución de llamada para pasar los cambios al componente padre
      onHourChange(index, Number(event.target.value));
    };
  
    return (
      <div style={{ marginBottom: '20px' }}>
        <label>{data.nombre}</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {data.horas.map((value, index) => (
            <input
              key={index}
              type="number"
              value={value}
              onChange={(event) => handleChange(index, event)}
              style={{ width: '50px', height: '50px', margin: '5px', textAlign: 'center' }}
            />
          ))}
          <div style={{ width: '50px', height: '50px', margin: '5px', textAlign: 'center', lineHeight: '50px', border: '1px solid black' }}>
            {data.total}
          </div>
        </div>
      </div>
    );
  };