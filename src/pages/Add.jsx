import React, { useState } from 'react'
import { AddUSer } from '../formComponents/AddUSer';
import { AddWwh } from '../formComponents/AddWwh';



export const Add = () => {


  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  let content;

  switch (activeTab) {
    case 0:
      content = <AddUSer />;
      break;
    case 1:
      content = <AddWwh />;
      break;
    default:
      content = null; // o cualquier contenido predeterminado
  }

  return (
    <div className='w-3/4'>
      


        <ul className="flex ml-2 ">
          <li className="-mb-px mr-1">
            <a
              className={`inline-block py-2 px-4 font-semibold ${activeTab === 0 ? ' border-l border-t border-r rounded-t text-indigo-700' : 'text-indigo-400 hover:text-blue-800'}`}
              href="#"
              onClick={() => handleTabClick(0)}
            >
              User
            </a>
          </li>
          <li className="mr-1">
            <a
              className={`inline-block py-2 px-4 font-semibold ${activeTab === 1 ? ' border-l border-t border-r rounded-t text-indigo-700' : 'text-indigo-400 hover:text-blue-800'}`}
              href="#"
              onClick={() => handleTabClick(1)}
            >
              Wwh
            </a>
          </li>
          <li className="mr-1">
            <a
              className={`inline-block py-2 px-4 font-semibold ${activeTab === 2 ? 'border-l border-t border-r rounded-t text-indigo-700' : 'text-indigo-400 hover:text-blue-800'}`}
              href="#"
              onClick={() => handleTabClick(2)}
            >
              Team Work
            </a>
          </li>

        </ul>

        <div className="border rounded-lg shadow-md overflow-x-auto p-4 ">


          {content
          }

        </div>
      </div>
   
  )
}
