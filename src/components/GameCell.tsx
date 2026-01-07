import "../styles/grid.css";
import { Piece, Player, Position } from "../types";
import blue_pawn from "../assets/images/blue_pawn.png";
import blue_king from "../assets/images/blue_king.png";
import red_pawn from "../assets/images/red_pawn.png";
import red_king from "../assets/images/red_king.png";
import { isShrineCellPosition } from "../utils";

const images: Record<string, string> = {
    "blue_student": blue_pawn,
    "blue_master": blue_king,
    "red_student": red_pawn,
    "red_master": red_king,
};

interface Props {
    isSelected: boolean,
    isValidCell: boolean,
    position: Position,
    piece: Piece | null,
    currentPlayer: Player,
    handleClick: (pos: Position) => void
}

const renderPiece = (el: Piece | null) => {
    if (!el) {
        return <div></div>;
    }

    const pieceImg = `${el.player}_${el.type}`
    return (
        <img
            alt="piece"
            src={images[pieceImg]}
        ></img>
    );
};

function GameCell({ isSelected, isValidCell, currentPlayer, position, piece, handleClick }: Props) {
    const isShrine = isShrineCellPosition(position)
    const redSide = position.row === 4
    const side = redSide ? "red" : "blue"
    const isUserPiece = currentPlayer === 'red' && piece?.player === 'red'
    const isAllowed = isUserPiece || isValidCell

    return (
        <div
            onClick={() => handleClick(position)}
            className={
                `grid_item ${isAllowed ? "allowed" : "not-allowed"} 
				${isShrine ? `${side}_shrine` : null}
				${isValidCell ? "valid_cell" : null}
				${isSelected ? "selected" : null} 
			`}
        >
            {renderPiece(piece)}
        </div>
    );
}

export default GameCell;
