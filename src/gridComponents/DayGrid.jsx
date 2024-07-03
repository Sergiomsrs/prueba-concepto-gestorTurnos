


export const DayGrid = ({children, dayIndex}) => {
  return (
    
    <table className="table-fixed w-full max-w-full overflow-hidden mt-0 pt-0" key={dayIndex}>
        {children}
    </table>
  )
}
