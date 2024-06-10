
export const Resumen = ({totalHoursByEmployee, employess }) => {



  return (
    <div className="overflow-x-auto">
  <table className="table-auto">
    <thead>
      <tr>
        <th>Empleado</th>
        <th>Jornada</th>
        <th>Total de Horas</th>
        <th>Variacion</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(totalHoursByEmployee).map(([nombre, total]) => (
        <tr key={nombre}>
          <td >{nombre}</td>
          <td className="text-center">
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas}
          </td>
          <td className="text-center">{total}</td>
          <td className="text-center">
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas - total}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    
  )
}
