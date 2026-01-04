import "../styles/grid.css";
import { CellProps } from "../types";
import blue_pawn from "../assets/images/blue_pawn.png";
import blue_king from "../assets/images/blue_king.png";
import red_pawn from "../assets/images/red_pawn.png";
import red_king from "../assets/images/red_king.png";
import { Cell } from "../classes/CellClass";

const images = {
    blue_pawn,
    blue_king,
    red_pawn,
    red_king,
};

function GameCell({ isSelected, position, piece, handleClick }: CellProps) {
    let shrineColor;
    if (piece.getIsShrine()) {
        let { side } = piece.getIsShrine() as { side: "red" | "blue" };
        shrineColor = side;
    } else {
        shrineColor = "";
    }

    const renderPiece = (el: Cell) => {
        let { piece } = el;
        if (!piece) {
            return <div></div>;
        }

        return (
            <img
                alt="piece"
                src={images[`${piece.side}_${piece.type}`]}
            ></img>
        );
    };

    return (
        <div
            data-tour={piece.piece === 0 ? 0 : `${piece.piece.side}_${piece.piece.type}`}
            onClick={() => handleClick(position)}
            className={
                `grid_item 
				${!!piece.getIsShrine() ? `${shrineColor}_shrine` : ""}
				${piece.getIsValid() ? "valid_cell" : ""}
				${isSelected ? "selected" : ""} 
			`}
        >
            {renderPiece(piece)}
        </div>
    );
}

export default GameCell;
