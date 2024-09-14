import { hours } from "../utils/data";

export const HeadRow = () => {
  return (
    <thead className="w-auto h-auto mb-3">
      <tr>
        <th className="md:w-20 md:text-base sm:w-16 sm:text-sm text-start align-bottom">Equipo</th>
        <th className="md:w-24 w-12 align-bottom">Nombre</th>
        {hours.salida && hours.salida.map((entrada, index) => (
          <th
            className={`relative w-2 h-12 text-xs md:w-4 md:h-12 md:text-sm`}
            key={index}
          >
            <div className="absolute top-1/3 transform -translate-y-1/2 -translate-x-1/2">
              {index % 4 === 0 && (
                <div className="flex justify-center">
                  <div>{entrada}</div>
                </div>
              )}
            </div>
            {index % 4 === 3 && (
              <div className="absolute right-0 top-1/2 h-1/2  bg-gray-300" style={{ zIndex: 1, width: 1.5 }}></div>
            )}
          </th>
        ))}
        <th className="w-12 pl-2 align-bottom">Total</th>
      </tr>
    </thead>
  )
}
