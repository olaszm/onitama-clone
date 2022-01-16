import "../styles/grid.css";
import { CellProps, Cell, Position } from "../types";


function GameCell({ isSelected, position, piece, handleClick }: CellProps) {

  const selectCell = () => {
    // calculateValidPositions(position, MONKEY)
    handleClick(position);
  };

  const renderPiece = (el: Cell) => {
    let { piece } = el;
    if (piece === 0) {
      return <></>;
    } else {
      return <span style={{ color: piece.side }}>{piece.type}</span>;
    }
  };

  return (
    <div
      onClick={selectCell}
      className={`grid_item ${isSelected ? "selected" : ""} ${
        piece.isValid ? "valid_cell" : ""
      }`}
    >
      {renderPiece(piece)}
    </div>
  );
}

export default GameCell;
