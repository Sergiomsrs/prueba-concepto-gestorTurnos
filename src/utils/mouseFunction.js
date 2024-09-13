

const handleMouseDown = (index) => {
    setStartSelection(index);
    setIsSelecting(true);
  };

  const handleMouseEnter = (index) => {
    if (isSelecting && startSelection !== null) {
      const selectionStart = Math.min(startSelection, index);
      const selectionEnd = Math.max(startSelection, index);
      const isStartSelected = hours[startSelection] === 1;
  
      for (let i = selectionStart; i <= selectionEnd; i++) {
        if (isStartSelected && hours[i] === 1) {
          // Si la casilla ya está marcada y fue marcada en el inicio del arrastre, no desmarcarla
          continue;
        }
  
        handleChange(i, isStartSelected ? 1 : 0);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  
  