import React, { useContext, useState } from 'react'
import { AddWwh } from '../formComponents/AddWwh';
import { AddTeamWork } from '../formComponents/AddTeamWork';
import { AddPto } from '../formComponents/AddPto';
import { AddDisp } from '../formComponents/AddDisp';
import { AppContext } from '../context/AppContext';
import { AddPublicHolidays } from '../formComponents/AddPublicHolidays';
import { useEmployees } from '@/Hooks/useEmployees';
import { AddUser } from '@/formComponents/AddUSer';



export const Add = () => {


  const { activeTab, setActiveTab } = useContext(AppContext);

  const { allEmployees } = useEmployees();

  const handleTabClick = (index) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index);
  };

  let content;

  switch (activeTab) {
    case 0:
      content = <AddUser allEmployees={allEmployees} />;
      break;
    case 1:
      content = <AddWwh allEmployees={allEmployees} />;
      break;
    case 2:
      content = <AddTeamWork allEmployees={allEmployees} />;
      break;
    case 3:
      content = <AddPto allEmployees={allEmployees} />;
      break;
    case 4:
      content = <AddDisp allEmployees={allEmployees} />;
      break;
    case 5:
      content = <AddPublicHolidays />;
      break;
    default:
      content = null;
  }

  return (
    <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto mt-8 animate-fade-in">


      <div className="border rounded-lg shadow-md overflow-x-auto p-4 ">

        <div className='mb-6'>



          <ul className="flex flex-row flex-nowrap gap-2 mb-6 border-b border-gray-300 dark:border-gray-600 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {[
              { label: "User" },
              { label: "Wwh" },
              { label: "Team Work" },
              { label: "Pto" },
              { label: "Disp" },
              { label: "PublicH" },
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
