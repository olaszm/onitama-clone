import "../styles/grid.css";
import { CellProps } from "../types";
import blue_pawn from "../assets/images/blue_pawn.png";
import blue_king from "../assets/images/blue_king.png";
import red_pawn from "../assets/images/red_pawn.png";
import red_king from "../assets/images/red_king.png";
import { Cell } from '../classes/CellClass'

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
		let { _piece } = el;
		if (_piece === undefined) {
			return <div></div>;
		} else {
			return (
				<img
					alt="piece"
					src={images[`${_piece.side}_${_piece.type}`]}
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
					${piece.getIsValid() ? "valid_cell" : ""}
					${!!piece.getIsShrine() ? `${piece.getIsShrine()}_shrine` : ""}
			`}
		>
			{renderPiece(piece)}
		</div>
	);
}

export default GameCell;
