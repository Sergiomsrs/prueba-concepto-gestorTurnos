import React, { useState } from "react";
import { entrada } from "../utils/data";
import { formatTime, getHighestNonZeroIndex, selectColor } from "../utils/function";
import { Modal } from "./Modal";

export const HorizontalBar = ({username, lastName, hours, onHourChange, teamWork, shiftDurationes, phours, isSelecting, setIsSelecting, startSelection, setStartSelection, handleMouseUp, id }) => {

  const [isModalOpen, setModalOpen] = useState(false);

  

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  const handleMouseDown = (index) => {
    setStartSelection(index);
    setIsSelecting(true);
  };

  const handleMouseEnter = (index) => {
    if (isSelecting && startSelection !== null) {
      const selectionStart = Math.min(startSelection, index);
      const selectionEnd = Math.max(startSelection, index);
      const isStartSelected = hours[startSelection] !== "Null" || hours[startSelection] === "PTO";

      for (let i = selectionStart; i <= selectionEnd; i++) {
        if (isInputDisabled(i)) {
          continue;
        }
        onHourChange(i, isStartSelected ? entrada[i] : "Null");
      }
    }
  };



  const handleClick = (index, isChecked) => {
    onHourChange(index, isChecked ? entrada[index] : "Null");
  };


  const isInputDisabled = (index) => {
    const highestIndex = getHighestNonZeroIndex(phours);
    return highestIndex >= (index + 48) ? true : false;
  }

  const getCursorClass = (isDisabled, value) => {
    if (isDisabled) return 'cursor-not-allowed opacity-30';
    if (value == "PTO")  return 'cursor-not-allowed opacity-30';
    return 'cursor-pointer';
  };
  
  const getBackgroundClass = (value, team) => {
    if (value === "PTO") return 'bg-red-200 '; 
    if (value === "Null") return 'bg-neutral-200';
    return selectColor(team); 
  };

  return (
    <>
      <td className="sm:text-base text-sm font-semibold text-gray-800 py-0 whitespace-nowrap">{teamWork}</td>
      <td 
      className="sm:text-base text-sm font-semibold text-gray-800 whitespace-nowrap max-w-none">
        <button onClick={handleOpenModal} className="mr-2 py-0" >{username} {lastName}</button>
        </td>
      {hours && hours.map((value, index) => (
        <td
          className={`relative md:w-24 w-12 text-center align-middle py-0 ${index % 4 === 3 ? 'border-45-height' : ''}`}
          key={index}
        >
          <input
            type="checkbox"
            className={`sm:w-4 sm:h-4 w-3 h-3 p-0 m-0 appearance-none border align-middle border-gray-400 rounded-3xl 
              ${getCursorClass(isInputDisabled(index), value)} 
              ${getBackgroundClass(value, teamWork)} 
              relative`}
            checked={value !== "Null" && value !== "PTO"}
            onChange={(event) => handleClick(index, event.target.checked)}
            disabled={isInputDisabled(index) || value === "PTO"}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseUp={handleMouseUp}
          />
          {index % 4 === 3 && (
            <div className="absolute right-0 top-1/2 h-1/2 bg-slate-400" style={{ zIndex: -1, width: 1 }}></div>
          )}
        </td>
      ))}
      <td className="sm:text-base text-xs w-12 pl-2 align-middle py-0.5 ">{formatTime(shiftDurationes)}</td>
      {isModalOpen && <Modal username={username} teamWork={teamWork} handleCloseModal={handleCloseModal} id={id}/>}
    </>
  );
};
