import React, { useState } from "react";
import { entrada } from "../utils/data";
import { formatTime, getHighestNonZeroIndex, selectColor } from "../utils/function";
import { Modal } from "./Modal";

export const HorizontalBar = ({ data, username, lastName, hours, onHourChange, teamWork, shiftDurationes, phours, isSelecting, setIsSelecting, startSelection, setStartSelection, handleMouseUp, id, rowIndex, inputRefsMatrix, numRows, numCols }) => {

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
      const isStartSelected = hours[startSelection] !== "Null" && hours[startSelection] !== "PTO";

      for (let i = selectionStart; i <= selectionEnd; i++) {
        if (isInputDisabled(i)) {
          // Saltar si el input está deshabilitado
          continue;
        }

        if (hours[i] === "CONFLICT") {
          // Si el valor es "CONFLICT", cambiarlo a "PTO"
          onHourChange(i, "PTO");
          continue;
        }

        if (hours[i] === "PTO") {
          // Saltar si el valor es "PTO"
          continue;
        }

        // Cambiar el valor según el estado inicial de selección
        onHourChange(i, isStartSelected ? "WORK" : "Null");
      }
    }
  };

  const handleClick = (index, isChecked) => {
    if (hours[index] === "CONFLICT") {
      onHourChange(index, "PTO");
    } else {
      onHourChange(index, isChecked ? "WORK" : "Null");
    }
  };

  const isInputDisabled = (index) => {
    const highestIndex = getHighestNonZeroIndex(phours);
    return highestIndex >= (index + 48) ? true : false;
  }

  const getCursorClass = (isDisabled, value) => {
    if (isDisabled) return 'cursor-not-allowed opacity-30';
    if (value == "PTO") return 'cursor-not-allowed opacity-30';
    return 'cursor-pointer';
  };

  const getBackgroundClass = (value, team) => {
    if (value === "PTO") return 'bg-red-200 ';
    if (value === "Null") return 'bg-neutral-200';
    if (value === "CONFLICT") return 'bg-amber-500 animate-pulse';

    return selectColor(team);
  };

  // Asegúrate de inicializar la fila de refs
  if (!inputRefsMatrix.current[rowIndex]) {
    inputRefsMatrix.current[rowIndex] = [];
  }

  const handleKeyDown = (event, colIndex) => {
    setLastFocusedIndex(colIndex);

    // Shift + flecha derecha
    if (event.key === "ArrowRight" && inputRefs.current[colIndex + 1]) {
      inputRefs.current[colIndex + 1].focus();
      event.preventDefault();

      if (event.shiftKey && lastFocusedIndex !== null) {
        const start = Math.min(lastFocusedIndex, colIndex + 1);
        const end = Math.max(lastFocusedIndex, colIndex + 1);
        // El valor base será el del input actual
        const baseValue = hours[colIndex];
        for (let i = start; i <= end; i++) {
          if (!isInputDisabled(i) && hours[i] !== "PTO") {
            if (baseValue === "Null") {
              handleClick(i, false); // false = "Null"
            } else if (baseValue === "WORK") {
              handleClick(i, true); // true = "WORK"
            }
            // Si es otro valor (ej: "CONFLICT"), puedes decidir qué hacer
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
            if (baseValue === "Null") {
              handleClick(i, false);
            } else if (baseValue === "WORK") {
              handleClick(i, true);
            }
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

  return (
    <>
      <td className="sm:text-base text-sm font-semibold text-gray-800 py-0 whitespace-nowrap">{teamWork}</td>
      <td
        className="sm:text-base text-sm font-semibold text-gray-800 whitespace-nowrap max-w-none">
        <button onClick={handleOpenModal} className="mr-2 py-0" >{username} {lastName}</button>
      </td>
      {hours && hours.map((value, colIndex) => (
        <td
          className={`relative md:w-24 w-12 text-center align-middle py-0 ${colIndex % 4 === 3 ? 'border-45-height' : ''}`}
          key={colIndex}
        >
          <input
            ref={el => {
              inputRefs.current[colIndex] = el;
              inputRefsMatrix.current[rowIndex][colIndex] = el;
            }}
            type="checkbox"
            className={`sm:w-4 sm:h-4 w-3 h-3 p-0 m-0 appearance-none border align-middle border-gray-400 rounded-3xl 
              ${getCursorClass(isInputDisabled(colIndex), value)} 
              ${getBackgroundClass(value, teamWork)} 
              relative`}
            checked={value !== "Null" && value !== "PTO"}
            onChange={(event) => handleClick(colIndex, event.target.checked)}
            disabled={isInputDisabled(colIndex) || value === "PTO"}
            onMouseDown={() => handleMouseDown(colIndex)}
            onMouseEnter={() => handleMouseEnter(colIndex)}
            onMouseUp={handleMouseUp}
            onKeyDown={e => handleKeyDown(e, colIndex)}
            tabIndex={0}
          />
          {colIndex % 4 === 3 && (
            <div className="absolute right-0 top-1/2 h-1/2 bg-slate-400" style={{ zIndex: -1, width: 1 }}></div>
          )}
        </td>
      ))}
      <td className="sm:text-base text-xs w-12 px-2 align-middle py-0.5 ">{calcularHorasTrabajadasFormato(hours)}</td>
      {isModalOpen && <Modal data={data} username={username} lastName={lastName} teamWork={teamWork} handleCloseModal={handleCloseModal} id={id} />}
    </>
  );
};
