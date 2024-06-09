import React, { useState } from "react";

export const HorizontalBar = ({ username, hours, onHourChange, seccion }) => {
  const [total, setTotal] = useState("00:00");
  const [startSelection, setStartSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleChange = (index, newValue) => {
    const newHours = [...hours];
    newHours[index] = newValue;
    const totalInMinutes = newHours.reduce((acc, val) => acc + val, 0) * 15;
    const hoursTotal = Math.floor(totalInMinutes / 60);
    const minutesTotal = totalInMinutes % 60;
    const totalFormatted = `${String(hoursTotal).padStart(2, "0")}:${String(
      minutesTotal
    ).padStart(2, "0")}`;
    setTotal(totalFormatted);
    onHourChange(index, newValue);
  };

  const handleMouseDown = (index) => {
    setStartSelection(index);
    setIsSelecting(true);
  };

  const handleMouseEnter = (index) => {
    if (isSelecting && startSelection !== null) {
      const selectionStart = Math.min(startSelection, index);
      const selectionEnd = Math.max(startSelection, index);
      const isStartSelected = hours[startSelection] === 1;
  
      for (let i = selectionStart; i <= selectionEnd; i++) {
        if (isStartSelected && hours[i] === 1) {
          // Si la casilla ya está marcada y fue marcada en el inicio del arrastre, no desmarcarla
          continue;
        }
  
        handleChange(i, isStartSelected ? 1 : 0);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  return (
    <>
      
      <td>{seccion}</td>
      <td>{username}</td>
      {hours.map((value, index) => (
        <td
          className="w-2 p-0 m-0 truncate"
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
            type="checkbox"
            checked={value === 1}
            onChange={(event) => handleChange(index, event.target.checked ? 1 : 0)}
          />
        </td>
      ))}
      <td>{total}</td>
    </>
  );
};
