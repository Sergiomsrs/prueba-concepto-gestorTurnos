import React, { useState } from "react";
import { entrada } from "../utils/data";
import { formatTime, getHighestNonZeroIndex, selectColor } from "../utils/function";
import { Modal } from "./Modal";

export const HorizontalBar = ({
  data, username, lastName, hours, onHourChange, teamWork,
  shiftDurationes, phours, isSelecting, setIsSelecting, startSelection,
  setStartSelection, handleMouseUp, id, rowIndex, inputRefsMatrix, numRows, numCols
}) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [lastFocusedIndex, setLastFocusedIndex] = useState(null);
  const inputRefs = React.useRef([]);

  function calcularHorasTrabajadasFormato(arr) {
    const workCount = arr.filter(bloque => bloque === "WORK").length;
    const totalMinutos = workCount * 15;
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleMouseDown = (index) => { setStartSelection(index); setIsSelecting(true); };

  const handleMouseEnter = (index) => {
    if (isSelecting && startSelection !== null) {
      const selectionStart = Math.min(startSelection, index);
      const selectionEnd = Math.max(startSelection, index);
      const isStartSelected = hours[startSelection] !== "Null" && hours[startSelection] !== "PTO";

      for (let i = selectionStart; i <= selectionEnd; i++) {
        if (isInputDisabled(i)) continue;
        if (hours[i] === "CONFLICT") { onHourChange(i, "PTO"); continue; }
        if (hours[i] === "PTO") continue;
        onHourChange(i, isStartSelected ? "WORK" : "Null");
      }
    }
  };

  const handleClick = (index, isChecked) => {
    if (hours[index] === "CONFLICT") onHourChange(index, "PTO");
    else onHourChange(index, isChecked ? "WORK" : "Null");
  };

  const isInputDisabled = (index) => {
    const highestIndex = getHighestNonZeroIndex(phours);
    return highestIndex >= (index + 48);
  };

  const getCursorClass = (isDisabled, value) => {
    if (isDisabled || value === "PTO") return 'cursor-not-allowed opacity-30';
    return 'cursor-pointer';
  };

  const getBackgroundClass = (value, team) => {
    if (value === "PTO") return 'bg-red-200';
    if (value === "Null") return 'bg-neutral-100';
    if (value === "CONFLICT") return 'bg-amber-500 animate-pulse';
    return selectColor(team);
  };

  if (!inputRefsMatrix.current[rowIndex]) inputRefsMatrix.current[rowIndex] = [];

  const handleKeyDown = (event, colIndex) => {
    setLastFocusedIndex(colIndex);

    // Shift + flecha derecha
    if (event.key === "ArrowRight" && inputRefs.current[colIndex + 1]) {
      inputRefs.current[colIndex + 1].focus();
      event.preventDefault();

      if (event.shiftKey && lastFocusedIndex !== null) {
        const start = Math.min(lastFocusedIndex, colIndex + 1);
        const end = Math.max(lastFocusedIndex, colIndex + 1);
        const baseValue = hours[colIndex];

        for (let i = start; i <= end; i++) {
          if (!isInputDisabled(i) && hours[i] !== "PTO") {
            handleClick(i, baseValue === "WORK");
          }
        }
      }
    }

    // Shift + flecha izquierda
    if (event.key === "ArrowLeft" && inputRefs.current[colIndex - 1]) {
      inputRefs.current[colIndex - 1].focus();
      event.preventDefault();

      if (event.shiftKey && lastFocusedIndex !== null) {
        const start = Math.min(lastFocusedIndex, colIndex - 1);
        const end = Math.max(lastFocusedIndex, colIndex - 1);
        const baseValue = hours[colIndex];

        for (let i = start; i <= end; i++) {
          if (!isInputDisabled(i) && hours[i] !== "PTO") {
            handleClick(i, baseValue === "WORK");
          }
        }
      }
    }

    // Flecha abajo
    if (event.key === "ArrowDown") {
      if (
        rowIndex + 1 < numRows &&
        inputRefsMatrix.current[rowIndex + 1] &&
        inputRefsMatrix.current[rowIndex + 1][colIndex]
      ) {
        inputRefsMatrix.current[rowIndex + 1][colIndex].focus();
        event.preventDefault();
      }
    }

    // Flecha arriba
    if (event.key === "ArrowUp") {
      if (
        rowIndex - 1 >= 0 &&
        inputRefsMatrix.current[rowIndex - 1] &&
        inputRefsMatrix.current[rowIndex - 1][colIndex]
      ) {
        inputRefsMatrix.current[rowIndex - 1][colIndex].focus();
        event.preventDefault();
      }
    }

    // Espacio o Enter: alternar solo el actual
    if ((event.key === " " || event.key === "Enter") && !isInputDisabled(colIndex) && hours[colIndex] !== "PTO") {
      handleClick(colIndex, !(hours[colIndex] !== "Null" && hours[colIndex] !== "PTO"));
      event.preventDefault();
    }
  };


  // Detecta inicio y fin de cada bloque WORK para redondear solo los bordes laterales
  const getRoundedClass = (index) => {
    if (hours[index] !== "WORK") return "";
    const prev = hours[index - 1] !== "WORK";
    const next = hours[index + 1] !== "WORK";
    if (prev && next) return "rounded-l-full rounded-r-full"; // un bloque de un solo input
    if (prev) return "rounded-l-full"; // primer input del bloque
    if (next) return "rounded-r-full"; // último input del bloque
    return "";
  };

  return (
    <>
      <td className="sm:text-base text-sm font-semibold text-gray-800 py-0 whitespace-nowrap">{teamWork}</td>
      <td className="sm:text-base text-sm font-semibold text-gray-800 whitespace-nowrap max-w-none">
        <button onClick={handleOpenModal} className="mr-2 py-0">{username} {lastName}</button>
      </td>

      {hours && hours.map((value, colIndex) => {
        const isWork = value === "WORK";
        const roundedClass = getRoundedClass(colIndex);

        return (
          <td key={colIndex} className={`relative w-6 h-fit text-center align-middle p-0`}>
            <input
              ref={el => {
                inputRefs.current[colIndex] = el;
                inputRefsMatrix.current[rowIndex][colIndex] = el;
              }}
              type="checkbox"
              className={`
                w-5 h-5 m-0 p-0 appearance-none border-none
                ${getCursorClass(isInputDisabled(colIndex), value)}
                ${getBackgroundClass(value, teamWork)}
                ${isWork ? 'border-t-2 border-b-2 border-neutral-200' : ''}
                ${roundedClass}
                focus:ring-2 focus:ring-indigo-400
                transition-all duration-150
                mx-auto my-1
                shadow-sm
              `}
              checked={value !== "Null" && value !== "PTO"}
              onChange={(e) => handleClick(colIndex, e.target.checked)}
              disabled={isInputDisabled(colIndex) || value === "PTO"}
              onMouseDown={() => handleMouseDown(colIndex)}
              onMouseEnter={() => handleMouseEnter(colIndex)}
              onMouseUp={handleMouseUp}
              onKeyDown={e => handleKeyDown(e, colIndex)}
              tabIndex={0}
              style={{ display: "block", minWidth: "1.5rem", minHeight: "1.25rem", maxWidth: "2rem", maxHeight: "1.5rem" }}
            />
          </td>
        );
      })}

      <td className="sm:text-base text-xs w-12 px-2 align-middle py-0.5">{calcularHorasTrabajadasFormato(hours)}</td>
      {isModalOpen && <Modal data={data} username={username} lastName={lastName} teamWork={teamWork} handleCloseModal={handleCloseModal} id={id} />}
    </>
  );
};
