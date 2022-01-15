import React from "react";

type Position = {
  x: number;
  y: number;
};

type CellProps = {
  position: Position;
  piece: number;
};



function Cell({ position, piece }: CellProps) {
    
    const calculateValidPositions = (position: Position):Position[] => {
        

        return [{x: 0,y: 0}]
    }
 
    return (
    <div>
      {position.x} - {position.y} - {piece}
    </div>
  );
}

export default Cell;
