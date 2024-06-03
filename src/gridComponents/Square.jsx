

export const Square = ({ children, updateBoard, index }) => {

    const handleClick = () => {
      updateBoard(index)
    }
  
  
    return (
      <div onClick={handleClick} className="w-12 h-12 border border-gray-300">
        {children}
      </div>
    )
  }