import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { entrada } from "../utils/data";

export const HorizontalBar = ({ username, hours, onHourChange, seccion, totales }) => {
  
  const [startSelection, setStartSelection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);



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
          className="border-none"
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
            className=" outline-none border-none box-border-none"
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
