import React, { useContext, useState } from 'react'
import { AddUSer } from '../formComponents/AddUSer';
import { AddWwh } from '../formComponents/AddWwh';
import { AddTeamWork } from '../formComponents/AddTeamWork';
import { AddPto } from '../formComponents/AddPto';
import { AddDisp } from '../formComponents/AddDisp';
import { AppContext } from '../context/AppContext';



export const Add = () => {


  const { activeTab, setActiveTab } = useContext(AppContext);

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
    case 2:
      content = <AddTeamWork />;
      break;
    case 3:
      content = <AddPto />;
      break;
    case 4:
      content = <AddDisp />;
      break;
    default:
      content = null; // o cualquier contenido predeterminado
  }

  return (
    <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto mt-8">


      <div className="border rounded-lg shadow-md overflow-x-auto p-4 ">

        <div className='mb-6'>



          <ul className="flex flex-row flex-nowrap gap-2 mb-6 border-b border-gray-300 dark:border-gray-600 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {[
              { label: "User" },
              { label: "Wwh" },
              { label: "Team Work" },
              { label: "Pto" },
              { label: "Disp" },
            ].map((tab, idx) => (
              <li key={tab.label} className="flex-none">
                <button
                  type="button"
                  onClick={() => handleTabClick(idx)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 min-w-[100px]
          ${activeTab === idx
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-gray-800"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
        `}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {content
        }

      </div>
    </div>

  )
}
