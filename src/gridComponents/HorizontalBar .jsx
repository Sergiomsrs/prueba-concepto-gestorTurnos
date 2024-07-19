import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { entrada } from "../utils/data";

export const HorizontalBar = ({ username, hours, onHourChange, seccion, totales, phours }) => {
  
  const [startSelection, setStartSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  console.log(phours);



  




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
        onHourChange(i, isStartSelected ? entrada[i] : 0);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartSelection(null);
  };

  const handleClick = (index, isChecked) => {
    onHourChange(index, isChecked ? entrada[index] : 0);
  };

  return (
    <>
      <td className="text-base font-semibold text-gray-800">{seccion}</td>
      <td className="text-base font-semibold text-gray-800">{username}</td>
      {hours.map((value, index) => (
        <td
          className={phours[index] !== 0 ? "bg-green-500" : "bg-red-500"}
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
            className="bg-gray-950"
            //className={phours[index] !== 0 ? "bg-green-500" : "bg-red-500"}
            type="checkbox"
            checked={value !== 0}
            onChange={(event) => handleClick(index, event.target.checked)}
          />
        </td>
      ))}
      <td>{totales}</td>
    </>
  );
};
