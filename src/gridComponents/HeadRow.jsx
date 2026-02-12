import { hours } from "../utils/data";

export const HeadRow = ({ startIndex = 28, endIndex = 90 } = {}) => {

  const visibleHours = hours.salida.slice(startIndex, endIndex);
  return (
    <thead className="">
      <tr>
        <th className="sm:text-base text-xs align-bottom text-start pr-2">Equipo</th>
        <th className="sm:text-base text-xs md:w-24 w-12 align-bottom pr-6">Nombre</th>
        {visibleHours && visibleHours.map((entrada, index) => (
          <th
            className="relative w-2 h-12 text-xs md:w-4 md:h-12 sm:text-xs"
            key={index}
          >
            <div className="absolute top-1/3 transform -translate-y-1/2 -translate-x-1/2">
              {index % 4 === 0 && (
                <div className="flex justify-center">
                  <div className="sm:text-sm text-xs">{entrada}</div>
                </div>
              )}
            </div>
            {index % 4 === 3 && (
              <div className="absolute right-0 top-1/2 h-1/2  bg-gray-300" style={{ zIndex: 1, width: 1.5 }}></div>
            )}
          </th>
        ))}
        <th className="sm:text-base text-xs w-12 pl-2 align-bottom">Total</th>
      </tr>
    </thead>
  )
}
