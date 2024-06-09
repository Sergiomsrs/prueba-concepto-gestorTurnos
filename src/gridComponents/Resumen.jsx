
export const Resumen = ({totalHoursByEmployee, employess }) => {
  return (
    <div class="overflow-x-auto">
  <table class="table-auto">
    <thead>
      <tr>
        <th class="">Empleado</th>
        <th class="px-4 py-2">Jornada</th>
        <th class="px-4 py-2">Total de Horas</th>
        <th class="px-4 py-2">Variacion</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(totalHoursByEmployee).map(([nombre, total]) => (
        <tr key={nombre}>
          <td >{nombre}</td>
          <td class="text-center">
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas}
          </td>
          <td class="text-center">{total}</td>
          <td class="text-center">
            {employess.find((emp) => emp.nombre === nombre)?.jornada[0].horas - total}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    
  )
}
