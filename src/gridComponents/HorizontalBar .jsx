import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { entrada, horizontalRow } from "../utils/data";

export const HorizontalBar = () => {

  const [row, setRow] = useState(horizontalRow);

  const onImputChange = (e) => {
    const { name, value } = e.target;
    setRow((prev) => {
      return { ...prev, [name]: value };
    });
  }

  console.log(row)


  return (
    <>
      <td className="text-base font-semibold text-gray-800">{"seccion"}</td>
      <td className="text-base font-semibold text-gray-800">{"username"}</td>
      {horizontalRow[2].map((value, index) => (
        <td
          className="w-2 p-0 m-0 truncate"
          key={index}
    
        >
          <input
            className="appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-green-500 checked:border-green-500 focus:outline-none"
            type="checkbox"
            name="checkbox"
            value={value}
    
          />
        </td>
      ))}
      <td>{"total"}</td>
    </>
  );
};
