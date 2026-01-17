import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { GameState, MovementCard, Player, Piece, Position, UIState, Difficulty } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { getBestMove, posKey } from "../utils";

function GameBoard({
    state,
    dispatcher,
    reducer,
    showRedMoveCards = true,
    showBlueMoveCards = true,
    showNextCard = true,
    onPieceSelect,
    onMoveCardSelect,
    uiState
}: {
    state: GameState;
    uiState: UIState;
    reducer: any
    dispatcher: any;
    showRedMoveCards?: boolean,
    showBlueMoveCards?: boolean,
    showNextCard?: boolean,
    onPieceSelect: (pos: Position, piece: Piece | null) => void
    onMoveCardSelect: (c: MovementCard, player: Player) => void
}) {
    const gameInstance = state.board;

    const renderMoveCards = (cards: readonly [MovementCard, MovementCard], side: Player) => {
        let selectedMoveCardName = uiState.selectedCard?.name

        return cards.map((card: MovementCard, idx: number) => {
            return (
                <MoveCardElement
                    isSelected={selectedMoveCardName === card.name}
                    card={card}
                    currentPlayer={side}
                    isMuted={side === 'blue'}
                    key={idx}
                    onClickHandler={() => onMoveCardSelect(card, side)}
                />
            );
        });
    };

    const renderBoard = (board: ReadonlyMap<string, Piece>, selectedCell: Position | null) => {
        return Array.from({ length: 5 }, (_, row) => (
            <React.Fragment key={row}>
                {Array.from({ length: 5 }, (_, col) => {
                    const position = { row, col };
                    const piece = board.get(posKey(position)) ?? null;
                    const isSelected = selectedCell !== null &&
                        selectedCell.row === row &&
                        selectedCell.col === col;

                    const isValidCell = uiState.highlightedMoves.some((p) => {
                        return p.col === position.col && p.row === position.row
                    })

                    return (
                        <GameCell
                            isSelected={isSelected}
                            isValidCell={isValidCell}
                            key={`${row}-${col}`}
                            position={position}
                            piece={piece}
                            currentPlayer={state.currentPlayer}
                            handleClick={(p) => {
                                onPieceSelect(p, piece)
                            }}
                        />
                    );
                })}
            </React.Fragment>
        ));
    };

    const makeAIMove = (gameState: GameState): GameState => {
        const getDepthForDifficulty = (difficulty: Difficulty): number => {
            switch (difficulty) {
                case "Easy": return 1;
                case "Medium": return 3;
                case "Impossible": return 5;
                default: return 3;
            }
        };

        const depth = getDepthForDifficulty(state.difficulty);
        const bestMove = getBestMove(gameState, depth);
        if (!bestMove) return gameState;

        return dispatcher(bestMove);
    };

    useEffect(() => {
        if (state.winner) return
        if (state.currentPlayer === 'red') return

        const timeout = setTimeout(() => {
            makeAIMove(state)
        }, 150)
        return () => {
            clearTimeout(timeout)
        }
    }, [state.currentPlayer, state.winner]);

    if (!gameInstance) return <div></div>;

    return (
        <div className="flex flex-wrap justify-center items-center w-full">
            {showNextCard &&
                <div
                    data-tour="rotating-card"
                    className="hidden md:flex flex-col"
                >
                    <p>Next card:</p>
                    <MoveCardElement
                        isSelected={false}
                        card={state.sideCard}
                        currentPlayer={state.currentPlayer}
                        isMuted={true}
                        onClickHandler={() => { }}
                    />
                </div>
            }
            <div className="flex flex-col items-center gap-4 w-full md:w-min">
                <div
                    className="flex md:hidden justify-center items-center mb-2"
                >
                    {state.sideCard && (
                        <div style={{ textAlign: "center" }}>
                            <p style={{ margin: "0 0 0.25rem 0", fontSize: "12px", fontWeight: "bold" }}>Next card:</p>
                            <MoveCardElement
                                isSelected={false}
                                card={state.sideCard}
                                currentPlayer="blue"
                                onClickHandler={() => { }}
                            />
                        </div>
                    )}
                </div>

                {showBlueMoveCards &&
                    <div
                        className="flex w-full gap-2 overflow-x-hidden"
                    >
                        {renderMoveCards(
                            state.playerCards.blue,
                            "blue"
                        )}
                    </div>

                }
                <div className="game-grid">
                    {renderBoard(state.board, uiState.selectedPiece)}
                </div>
                {showRedMoveCards &&
                    <div
                        data-tour="player-move-cards"
                        className="flex w-full gap-2 overflow-x-hidden"
                    >
                        {renderMoveCards(
                            state.playerCards.red,
                            "red"
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

export default GameBoard;
