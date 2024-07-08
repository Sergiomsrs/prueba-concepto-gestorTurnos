import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { entrada } from "../utils/data";

export const HorizontalBar = ({ username, hours, onHourChange, seccion }) => {
  const { data } = useContext(AppContext);
  const [total, setTotal] = useState("00:00");
  const [startSelection, setStartSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleChange = (index, newValue) => {
    const newHours = [...hours];
    newHours[index] = newValue;
    //const totalInMinutes = newHours.reduce((acc, val) => acc + val, 0) * 15;
    const totalInMinutes = newHours.filter(item => item !== 0).length * 15;
    const hoursTotal = Math.floor(totalInMinutes / 60);
    const minutesTotal = totalInMinutes % 60;
    const totalFormatted = `${String(hoursTotal).padStart(2, "0")}:${String(minutesTotal).padStart(2, "0")}`;
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
      const isStartSelected = hours[startSelection] !== 0;

      for (let i = selectionStart; i <= selectionEnd; i++) {
        handleChange(i, isStartSelected ? entrada[i] : 0);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartSelection(null);
  };

  const handleClick = (index, isChecked) => {
    handleChange(index, isChecked ? entrada[index] : 0);
  };

  return (
    <>
      <td className="text-base font-semibold text-gray-800">{seccion}</td>
      <td className="text-base font-semibold text-gray-800">{username}</td>
      {hours.map((value, index) => (
        <td
          className="w-2 p-0 m-0 truncate"
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
            className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-500 checked:border-green-500 focus:outline-none"
            type="checkbox"
            checked={value !== 0}
            onChange={(event) => handleClick(index, event.target.checked)}
          />
        </td>
      ))}
      <td>{total}</td>
    </>
  );
};
