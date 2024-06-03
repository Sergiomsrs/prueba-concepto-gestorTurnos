import { useState } from "react";

const employees = ['Ross Geller', 'Marta Geller', 'Chandler Bing'];

export const HorizontalBar = ({ username, hours, onHourChange }) => {
    const [data, setData] = useState({
        nombre: username,
        horas: hours || Array(56).fill(0),
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
        <div className="flex items-center">
            <label className="w-28">{data.nombre}</label>
            <div className="flex items-center">
                {data.horas.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[01]*"
                        value={value}
                        onChange={(event) => handleChange(index, event)}
                        style={{ width: '10px', height: '15px', margin: '5px', textAlign: 'center' }}
                    />
                ))}
                <div className="w-12 j">
                    {data.total}
                </div>
            </div>
        </div>
    );
};