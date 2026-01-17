import "../styles/moveCard.css";
import { MovementCard, Player } from "../types";

interface Props {
    isSelected: boolean,
    isMuted?: boolean,
    card: MovementCard
    currentPlayer: Player,
    onClickHandler: (card: MovementCard, side: Player) => void
}

const MovementCardDisplay = ({
    card,
    isSelected,
    isMuted,
    currentPlayer,
    onClickHandler,

}: Props) => {
    // Flip moves for red player (they view from bottom)
    const getAdjustedMoves = () => {
        if (currentPlayer === 'red') {
            return card.moves.map(move => ({
                rowOffset: -move.rowOffset,
                colOffset: move.colOffset
            }));
        }
        return card.moves;
    };

    const adjustedMoves = getAdjustedMoves();

    // 5x5 grid with center as piece position
    const renderMoveGrid = () => {
        const grid = [];
        for (let row = -2; row <= 2; row++) {
            for (let col = -2; col <= 2; col++) {
                const isCenter = row === 0 && col === 0;
                const isMove = adjustedMoves.some(
                    m => m.rowOffset === row && m.colOffset === col
                );

                // Temple arches (fixed positions in grid)
                const isTopTemple = row === -2 && col === 0;
                const isBottomTemple = row === 2 && col === 0;

                grid.push(
                    <div
                        key={`${row}-${col}`}
                        className={`
              move-cell
              ${isCenter ? 'center' : ''}
              ${isMove ? 'valid-move' : ''}
              ${isTopTemple ? 'temple-blue' : ''}
              ${isBottomTemple ? 'temple-red' : ''}
            `}
                    >
                        {isCenter && (
                            <div className={`piece-icon ${currentPlayer}`}>♟</div>
                        )}
                        {isMove && !isCenter && (
                            <div className="move-indicator" />
                        )}
                    </div>
                );
            }
        }
        return grid;
    };

    return (
        <div
            className={`movement-card ${isSelected ? 'selected' : ''} ${isMuted ? "muted" : ""}`}
            onClick={() => onClickHandler(card, currentPlayer)}
        >
            <div className="card-content">
                <div className="card-info">
                    <div className="card-name">{card.name}</div>
                </div>

                <div className="move-grid">
                    {renderMoveGrid()}
                </div>
            </div>
        </div>
    );
};

export default MovementCardDisplay
