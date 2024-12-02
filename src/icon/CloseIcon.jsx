import React from 'react'

export const CloseIcon = ({ sideBarClick }) => {
  return (
    <div className='flex flex-row justify-end'>
    <button onClick={sideBarClick} className="p-2 bg-transparent border-none cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
        <path d="M18 6l-12 12"></path>
        <path d="M6 6l12 12"></path>
      </svg>
    </button>
    </div>
  );
};
