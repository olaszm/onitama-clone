import "../styles/grid.css";
import { CellProps, Cell } from "../types";
import blue_pawn from "../images/blue_pawn.png";
import blue_king from "../images/blue_king.png";
import red_pawn from "../images/red_pawn.png";
import red_king from "../images/red_king.png";

const images = {
	blue_pawn,
	blue_king,
	red_pawn,
	red_king,
};

function GameCell({ isSelected, position, piece, handleClick }: CellProps) {
	const selectCell = () => {
		handleClick(position);
	};

	const renderPiece = (el: Cell) => {
		let { piece } = el;
		if (piece === 0) {
			return <div></div>;
		} else {
			return (
				<img
					alt="piece"
					src={images[`${piece.side}_${piece.type}`]}
				></img>
			);
			// return <span style={{ color: piece.side }}>{piece.type}</span>;
		}
	};

	return (
		<div
			onClick={selectCell}
			className={`grid_item 
      ${isSelected ? "selected" : ""} 
      ${piece.isValid ? "valid_cell" : ""}
      ${piece.isShrine ? "shrine" : ""}
      `}
		>
			{renderPiece(piece)}
		</div>
	);
}

export default GameCell;
