import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { GameState, MovementCard, Player, Piece, Position, UIState, Difficulty } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { getBestMove, posKey } from "../utils";
import { moveToString } from "../parser";

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

    const renderMoveHistory = () => {
        const history = state.history;
        const turns: Array<[string, string?]> = [];

        for (let i = 0; i < history.length; i += 2) {
            const move1 = history[i];
            const move2 = history[i + 1];
            turns.push([moveToString(move1), move2 ? moveToString(move2) : undefined]);
        }

        const startingPlayer = state.sideCard.startingPlayer;
        const otherPlayer = startingPlayer === 'red' ? 'red' : 'blue';

        return (
            <div className="h-[90px] overflow-y-auto border border-[var(--main-highlight)] rounded bg-[var(--black)]">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-[var(--main-highlight)]">
                        <tr>
                            <th className="text-left p-2 text-[var(--text)] font-semibold">#</th>
                            <th className="text-left p-2 text-[var(--text)] font-semibold">
                                P1
                            </th>
                            <th className="text-left p-2 text-[var(--text)] font-semibold">
                                P2
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {turns.map((turn, idx) => (
                            <tr key={idx} className="border-b border-[var(--main-highlight)] hover:bg-[var(--main-highlight)]">
                                <td className="p-2 text-center text-[var(--text)]">{idx + 1}</td>
                                <td className="p-2 text-[var(--text)]">{turn[0]}</td>
                                <td className="p-2 text-[var(--text)]">{turn[1] || ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
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
        <div className="flex flex-wrap justify-center items-center w-full gap-4">
            {showNextCard &&
                <div
                    data-tour="rotating-card"
                    className="hidden md:flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <p>Next card:</p>
                        <MoveCardElement
                            isSelected={false}
                            isSideCard={true}
                            card={state.sideCard}
                            currentPlayer={state.currentPlayer}
                            isMuted={true}
                            onClickHandler={() => { }}
                        />
                    </div>
                    {state.history.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p>Move history:</p>
                            <div className="flex flex-col gap-1">
                                {renderMoveHistory()}
                            </div>
                        </div>
                    )}
                </div>
            }
            <div className="flex flex-col items-center gap-4 w-full sm:w-min">
                <div
                    className="flex md:hidden justify-center items-center"
                >
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

                        {state.sideCard && (
                            <MoveCardElement
                                className="md:hidden"
                                isSelected={false}
                                isSideCard={true}
                                card={state.sideCard}
                                currentPlayer="blue"
                                onClickHandler={() => { }}
                            />
                        )}
                    </div>
                }

                <div className="md:hidden flex flex-col gap-2">
                    <p>Move history:</p>
                    <div className="flex flex-col gap-1">
                        {renderMoveHistory()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameBoard;
