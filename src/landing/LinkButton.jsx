import React from 'react'
import { Link } from 'react-router-dom'

export const LinkButton = ({ to, children }) => {
  return (
    <Link
    to={to}
    className="inline-flex border-gray-300 items-center justify-center gap-2 px-3 py-2 space-x-2 text-base transition text-white bg-gray-800 border focus-visible:ring-yellow-500/80 text-md hover:bg-gray-400 hover:border-gray-500 group max-w-fit rounded-xl hover:text-white focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-black"
  >
    {children}
  </Link>
  )
}
