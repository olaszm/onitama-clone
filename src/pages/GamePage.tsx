import { useState, useReducer, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { newGame, reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";
import SettingsModal from "../components/SettingsModal";
import DifficultySelectionModal from "../components/DifficultySelectionModal";
import { GameState, MovementCard, Piece, Player, Position, UIState, Difficulty } from "../types";
import { getValidMoves } from "../utils/cards";

function GamePage() {
    const [state, dispatch] = useReducer(reducer, newGame(undefined, "Medium"));
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGameOverModalOpen, setGameOverModalOpen] = useState(false)
    const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(true)

    // UI state is local component state
    const [uiState, setUIState] = useState<UIState>({
        selectedPiece: null,
        selectedCard: null,
        highlightedMoves: [],
        hoveredPosition: null,
        animatingMove: null
    });

    const resetUIState = () => {
        setUIState({
            selectedPiece: null,
            selectedCard: null,
            highlightedMoves: [],
            hoveredPosition: null,
            animatingMove: null
        })
    }

    const handlePieceSelect = (pos: Position, piece: Piece | null) => {
        if (state.winner) return
        if (piece === null || state.currentPlayer !== piece.player) {
            const isHighlightedPos = uiState.highlightedMoves.some((p) => {
                return p.col === pos.col && p.row === pos.row
            })
            if (!isHighlightedPos) return

            const { selectedPiece, selectedCard } = uiState
            if (!selectedCard) return
            if (!selectedPiece) return
            dispatch({
                type: 'move_piece',
                from: selectedPiece,
                to: pos,
                cardUsed: selectedCard
            })
            setUIState(state => {
                return { ...state, selectedCard: null, selectedPiece: null, highlightedMoves: [] }
            })

            return
        }

        setUIState(state => {
            return { ...state, selectedPiece: pos }
        })
    }

    const handleMovecardSelect = (card: MovementCard, player: Player) => {
        if (state.winner) return
        if (state.currentPlayer !== player) return

        return setUIState(state => {
            return { ...state, selectedCard: card }
        })
    }

    const resetGame = () => {
        dispatch({ type: "restart_game" })
        resetUIState()
    }

    useEffect(() => {
        const { selectedPiece, selectedCard } = uiState
        if (selectedPiece && selectedCard) {
            const validMoves = getValidMoves(state.board, selectedPiece, selectedCard, state.currentPlayer)

            return setUIState(state => {
                return { ...state, highlightedMoves: validMoves }
            })
        }


    }, [uiState.selectedPiece, uiState.selectedCard])

    const handleGameOver = (state: GameState) => {
        setGameOverModalOpen(true)
    }

    useEffect(() => {
        // GameOver
        if (!state.winner) return
        handleGameOver(state)
    }, [state.winner])

    const handleDifficultySelect = (difficulty: Difficulty) => {
        dispatch({ type: "set_difficulty", difficulty: difficulty })
        setIsDifficultyModalOpen(false)
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center my-2">
                <button
                    className="text-white cursor-pointer hover:text-[#1565C0] transition-colors"
                    onClick={() => {
                        setIsSettingsOpen(true);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <div className="flex flex-row gap-2 items-center">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${state.winner
                                ? 'border border-white text-white'
                                : state.currentPlayer === 'red'
                                    ? 'bg-[#D98BA1] text-white'
                                    : 'bg-[#1565C0] text-white'
                            }`}
                    >
                        {`${state.currentPlayer}'s Turn`}
                    </span>
                    <span
                        className="px-3 py-1 rounded-full text-sm border border-white text-white"
                    >
                        {state.difficulty}
                    </span>
                </div>
            </div>
            <GameBoard
                onPieceSelect={handlePieceSelect}
                onMoveCardSelect={handleMovecardSelect}
                state={state}
                dispatcher={dispatch}
                reducer={reducer}
                uiState={uiState}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                handleClose={() => setIsSettingsOpen(false)}
            >
                <ul className="pt-0">
                    <li
                        className="cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                        onClick={() => {
                            setIsDifficultyModalOpen(true)
                            setIsSettingsOpen(false)
                        }}
                    >
                        Change Difficulty
                    </li>
                    <li
                        className="cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                        onClick={() => {
                            resetGame()
                            setIsSettingsOpen(false);
                        }}
                    >
                        Reset
                    </li>
                    <li className="p-2">
                        <Link
                            to="/"
                            className="no-underline text-white hover:text-[#1565C0] transition-colors"
                        >
                            End Game
                        </Link>
                    </li>
                </ul>
            </SettingsModal>
            <GameOverModal
                isOpen={(!!state.winCondition && isGameOverModalOpen) ?? false}
                winner={state.winner as Player}
                winCondition={state.winCondition}
                handleClose={(reason: "close" | "new") => {
                    if (reason === "new") {
                        resetGame()
                        setGameOverModalOpen(false)
                        return
                    }
                    if (reason === "close") return setGameOverModalOpen(false)
                }}
            ></GameOverModal>
            <DifficultySelectionModal
                isOpen={isDifficultyModalOpen}
                handleDifficultySelect={handleDifficultySelect}
            />
        </div>
    );
}

export default GamePage;
