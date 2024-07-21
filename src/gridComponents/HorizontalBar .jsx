import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { entrada } from "../utils/data";
import { getHighestNonZeroIndex } from "../utils/function";

export const HorizontalBar = ({ username, hours, onHourChange, seccion, totales, phours }) => {

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


  const isInputDisabled = (index) => {
    const highestIndex = getHighestNonZeroIndex(phours);
    return highestIndex >= (index + 48) ? true : false;
  }

  return (
    <>
      <td className="text-base font-semibold text-gray-800">{seccion}</td>
      <td className="text-base font-semibold text-gray-800">{username}</td>
      {hours.map((value, index) => (
        <td
          //className={phours[index+48] !== 0 && phours[index+48] !== undefined ? "bg-green-500" : "bg-red-500"}
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
              type="checkbox"
              className={`w-4 h-4 p-0 m-0 appearance-none border border-gray-400 rounded-3xl ${
                isInputDisabled(index) ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
              } ${
                value !== 0 ? 'bg-indigo-500' : 'bg-neutral-200'
              } relative`}
              checked={value !== 0}
              onChange={(event) => handleClick(index, event.target.checked)}
              disabled={isInputDisabled(index)}
            />
   
        </td>
      ))}
      <td>{totales}</td>
    </>
  );
};
