import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { GameState, MovementCard, Player, Piece, Position, UIState, Difficulty } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { getBestMove, posKey } from "../utils";
import { moveToString } from "../parser";
import { fileToNumber, rankToNumber } from "../reducers/originalReducer";

function GameBoard({
    state,
    dispatcher,
    reducer,
    showRedMoveCards = true,
    showBlueMoveCards = true,
    showNextCard = true,
    onPieceSelect,
    onMoveCardSelect,
    uiState,
    isInteractionsBlocked = false,
    historyIndex,
    onHistoryNavigate
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
    isInteractionsBlocked?: boolean
    historyIndex: number | null;
    onHistoryNavigate: (index: number | null) => void;
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
        // Get current history move if we're viewing history
        const currentHistoryMove = historyIndex !== null ? state.history[historyIndex] : null;
        
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
                    });

                    // Calculate if this cell is part of the current history move
                    const isHistoryFrom = currentHistoryMove !== null &&
                        row === rankToNumber(currentHistoryMove.from.rank) &&
                        col === fileToNumber(currentHistoryMove.from.file);
                    
                    const isHistoryTo = currentHistoryMove !== null &&
                        row === rankToNumber(currentHistoryMove.to.rank) &&
                        col === fileToNumber(currentHistoryMove.to.file);

                    return (
                        <GameCell
                            isSelected={isSelected}
                            isValidCell={isValidCell}
                            isHistoryFrom={isHistoryFrom}
                            isHistoryTo={isHistoryTo}
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
        const turns: Array<[string, string?, number?, number?]> = [];

        for (let i = 0; i < history.length; i += 2) {
            const move1 = history[i];
            const move2 = history[i + 1];
            turns.push([moveToString(move1), move2 ? moveToString(move2) : undefined, i, i + 1]);
        }

        const startingPlayer = state.sideCard.startingPlayer;
        const otherPlayer = startingPlayer === 'red' ? 'blue' : 'red';

        const canGoBack = historyIndex !== null ? historyIndex > 0 : history.length > 0;
        const canGoForward = historyIndex !== null && historyIndex < history.length - 1;

        const handleBack = () => {
            if (history.length === 0) return;
            if (historyIndex === null) {
                // Start from the most recent move
                onHistoryNavigate(history.length - 1);
            } else if (historyIndex > 0) {
                onHistoryNavigate(historyIndex - 1);
            }
        };

        const handleForward = () => {
            if (historyIndex === null) return;
            if (historyIndex < history.length - 1) {
                onHistoryNavigate(historyIndex + 1);
            } else {
                // Return to live game
                onHistoryNavigate(null);
            }
        };

        const getMoveStyle = (moveIdx: number | undefined) => {
            if (moveIdx === undefined) return "p-2 text-[var(--text)]";
            if (historyIndex === null) return "p-2 text-[var(--text)]";
            if (moveIdx === historyIndex) return "p-2 text-[var(--text)] bg-[var(--main-highlight)] font-bold";
            if (moveIdx < historyIndex) return "p-2 text-[var(--text)] opacity-50";
            return "p-2 text-[var(--text)]";
        };

        return (
            <div className="flex flex-col gap-2">
                <div className="h-[90px] overflow-y-auto border border-[var(--main-highlight)] rounded bg-[var(--black)]">
                    <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-[var(--main-highlight)]">
                            <tr>
                                <th className="text-left p-2 text-[var(--text)] font-semibold">#</th>
                                <th className="text-left p-2 text-[var(--text)] font-semibold capitalize">
                                    {startingPlayer}
                                </th>
                                <th className="text-left p-2 text-[var(--text)] font-semibold capitalize">
                                    {otherPlayer}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {turns.map((turn, idx) => (
                                <tr key={idx} className="border-b border-[var(--main-highlight)]">
                                    <td className="p-2 text-center text-[var(--text)]">{idx + 1}</td>
                                    <td className={getMoveStyle(turn[2])}>{turn[0]}</td>
                                    <td className={getMoveStyle(turn[3])}>{turn[1] || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleBack}
                        disabled={!canGoBack}
                        className={`flex-1 px-3 py-2 text-sm border rounded transition-colors ${
                            canGoBack
                                ? 'border-white text-white hover:bg-white hover:text-[#131C26]'
                                : 'border-gray-500 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={!canGoForward}
                        className={`flex-1 px-3 py-2 text-sm border rounded transition-colors ${
                            canGoForward
                                ? 'border-white text-white hover:bg-white hover:text-[#131C26]'
                                : 'border-gray-500 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Forward →
                    </button>
                </div>
                {historyIndex !== null && (
                    <button
                        onClick={() => onHistoryNavigate(null)}
                        className="w-full px-3 py-2 text-sm border border-[var(--main-highlight)] text-[var(--text)] rounded hover:bg-[var(--main-highlight)] transition-colors"
                    >
                        Return to Live Game
                    </button>
                )}
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
        if (isInteractionsBlocked) return

        const timeout = setTimeout(() => {
            makeAIMove(state)
        }, 150)
        return () => {
            clearTimeout(timeout)
        }
    }, [state.currentPlayer, state.winner, isInteractionsBlocked]);

    if (!gameInstance) return <div></div>;

    return (
        <div className="flex flex-col lg:flex-row w-full h-full gap-2 lg:gap-4 p-2 lg:p-4 overflow-hidden">
            <div className="flex flex-col w-full lg:w-3/4 gap-4 items-center justify-center min-h-0">
                {showBlueMoveCards &&
                    <div
                        className="flex w-full gap-2 overflow-x-hidden justify-center shrink-0"
                    >
                        {renderMoveCards(
                            state.playerCards.blue,
                            "blue"
                        )}
                    </div>
                }
                <div className="game-grid flex-1">
                    {renderBoard(state.board, uiState.selectedPiece)}
                </div>
                {showRedMoveCards &&
                    <div
                        data-tour="player-move-cards"
                        className="flex w-full gap-2 overflow-x-hidden justify-center shrink-0"
                    >
                        {renderMoveCards(
                            state.playerCards.red,
                            "red"
                        )}

                        {state.sideCard && (
                            <MoveCardElement
                                className="lg:hidden"
                                isSelected={false}
                                isSideCard={true}
                                card={state.sideCard}
                                currentPlayer="blue"
                                onClickHandler={() => { }}
                            />
                        )}
                    </div>
                }
            </div>
            {showNextCard &&
                <div className="w-full lg:w-1/4 flex flex-col gap-4 shrink-0 overflow-hidden">
                    <div
                        data-tour="rotating-card"
                        className="hidden lg:flex flex-col gap-2 shrink-0"
                    >
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
                        <div className="hidden lg:flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
                            <p>Move history:</p>
                            <div className="flex flex-col gap-1 min-h-0 overflow-auto">
                                {renderMoveHistory()}
                            </div>
                        </div>
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
    );
}

export default GameBoard;
