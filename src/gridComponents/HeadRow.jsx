
import { hours } from "../utils/data";



export const HeadRow = () => {
  return (
    <thead className="w-auto h-auto mb-3">
    <tr>
    <th className="md:w-20 md:text-base sm:w-16 sm:text-sm text-start align-bottom ">Team</th>
    <th className="md:w-24 w-12  align-bottom">Name</th>
    {hours.entrada.map((entrada, index) => (
      <th className="
      w-2 h-36 text-xs
      md:w-4 md:h-28 md:text-sm
      
     
      rotate-90
    " key={index}>
      <div className="flex justify-center"> 
        <div>{entrada}</div>
        <div>-</div>
        <div>{hours.salida[index]}</div>
      </div>
      </th>
    ))}
    <th className="w-12 pl-2 align-bottom">Total</th>
    </tr>
  </thead>
  )
}
