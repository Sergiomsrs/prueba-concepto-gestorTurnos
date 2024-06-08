
export const HeadRow = ({day, hours}) => {
  return (
    <div className="flex items-center">
    <label className="w-28">{day}</label>
    <div className="flex items-center">
      {hours.map((value, index) => (
        <label key={index} className="w-10 text-center  rotate-90">{value}</label>
      ))}
      <div className="w-12">Total</div>
    </div>
  </div>
  )
}
