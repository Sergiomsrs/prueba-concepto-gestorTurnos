import React, { useState } from "react";
import { entrada } from "../utils/data";
import { formatTime, getHighestNonZeroIndex } from "../utils/function";

export const HorizontalBar = ({ username, hours, onHourChange, teamWork, shiftDurationes, phours }) => {

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
      const isStartSelected = hours[startSelection] !== "Null";

      for (let i = selectionStart; i <= selectionEnd; i++) {
        onHourChange(i, isStartSelected ? entrada[i] : "Null");
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartSelection(null);
  };

  const handleClick = (index, isChecked) => {
    onHourChange(index, isChecked ? entrada[index] : "Null");
  };


  const isInputDisabled = (index) => {
    const highestIndex = getHighestNonZeroIndex(phours);
    return highestIndex >= (index + 48) ? true : false;
  }

  return (
    <>
      <td className="text-base font-semibold text-gray-800">{teamWork}</td>
      <td className="text-base font-semibold text-gray-800">{username}</td>
      {hours && hours.map((value, index) => (
        <td
          className={`relative md:w-24 w-12 text-center align-bottom ${index % 4 === 3 ? 'border-45-height' : ''}`}
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseUp={handleMouseUp}
        >
          <input
            type="checkbox"
            className={`w-4 h-4 p-0 m-0 appearance-none border border-gray-400 rounded-3xl ${isInputDisabled(index) || value === "NP" ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
              } ${value !== "Null" && value !== "NP" ? 'bg-indigo-500' : 'bg-neutral-200'
              } relative`}
            checked={value !== "Null" && value !== "NP"}
            onChange={(event) => handleClick(index, event.target.checked)}
            disabled={isInputDisabled(index) || value === "NP"}
          />
          {index % 4 === 3 && (
            <div className="absolute right-0 top-1/2 h-1/2 bg-slate-400" style={{ zIndex: -1, width: 1 }}></div>
          )}
        </td>
      ))}
      <td className="w-12 pl-2 align-bottom">{formatTime(shiftDurationes)}</td>
    </>
  );
};
