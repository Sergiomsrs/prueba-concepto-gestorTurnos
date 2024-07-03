
import { hours } from "../utils/data";



export const HeadRow = () => {
  return (
    <thead className="w-auto h-auto mb-3">
    <tr>
    <th className="w-10 p-0 align-bottom">Seccion</th>
    <th className="w-12 p-0 align-bottom">Nombre</th>
    {hours.entrada.map((entrada, index) => (
      <th className="rotate-90 w-2 h-36" key={index}>
      <div className="flex justify-center"> {/* Add justify-center class */}
        <div>{entrada}</div>
        <div>-</div>
        <div>{hours.salida[index]}</div>
      </div>
      </th>
    ))}
    <th className="w-8 align-bottom">Total</th>
    </tr>
  </thead>
  )
}
