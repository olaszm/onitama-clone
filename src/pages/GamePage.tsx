import { useState, useReducer, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { List, ListItem } from "@mui/material";
import { newGame, reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";
import SettingsModal from "../components/SettingsModal";

import SettingsIcon from "@mui/icons-material/Settings"; import { GameState, MovementCard, Piece, Player, Position, UIState } from "../types";
import { getValidMoves } from "../utils/cards";

function GamePage() {
    const [state, dispatch] = useReducer(reducer, newGame());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGameOverModalOpen, setGameOverModalOpen] = useState(false)

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

    return (
        <div>
            <div style={{ margin: "0.5rem 0" }}>
                <SettingsIcon
                    onClick={() => {
                        setIsSettingsOpen(true);
                    }}
                />
            </div>
            <GameBoard
                style={{
                    margin: "2rem 0",
                }}
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
                <List sx={{ pt: 0 }}>
                    <ListItem
                        button
                        onClick={() => {
                            resetGame()
                            setIsSettingsOpen(false);
                        }}
                    >
                        Reset
                    </ListItem>
                    <ListItem>
                        <Link
                            to="/"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            End Game
                        </Link>
                    </ListItem>
                </List>
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
        </div>
    );
}

export default GamePage;
