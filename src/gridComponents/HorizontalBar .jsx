import { useState } from "react";


export const HorizontalBar = ({ username, hours, totalHours, onHourChange }) => {
    const [total, setTotal] = useState(totalHours);
  
    const handleChange = (index, event) => {
      const newValue = Number(event.target.value);
      const newHours = [...hours];
      newHours[index] = newValue;
      
      const totalInMinutes = newHours.reduce((acc, val) => acc + val, 0) * 15;
      const hoursTotal = Math.floor(totalInMinutes / 60);
      const minutesTotal = totalInMinutes % 60;
      const totalFormatted = `${String(hoursTotal).padStart(2, '0')}:${String(minutesTotal).padStart(2, '0')}`;
      
      setTotal(totalFormatted);
      onHourChange(index, newValue);
    };
  
    return (
      <div className="flex items-center">
        <label className="w-28">{username}</label>
        <div className="flex items-center">
          {hours.map((value, index) => (
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
          <div className="w-12">{total}</div>
        </div>
      </div>
    );
  };