import { useState, useReducer, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardContent, Stack, Typography, Alert } from "@mui/material";
import { newGame, reducer } from "../reducers/originalReducer";
import {
    TutorialStageName,
    MovementCard,
    Piece,
    Player,
    Position,
    UIState,
} from "../types";
import { getValidMoves } from "../utils/cards";
import {
    TUTORIAL_STAGES,
    getTutorialStageByName,
    getNextTutorialStage,
    isActionAllowed,
    validateTutorialAction,
} from "../utils/tutorial";

function TutorialGamePage() {
    const [state, dispatch] = useReducer(reducer, newGame(undefined, "Easy"));
    const [currentStage, setCurrentStage] = useState<TutorialStageName>("select_piece");
    const [stageComplete, setStageComplete] = useState(false);

    // UI state is local component state
    const [uiState, setUIState] = useState<UIState>({
        selectedPiece: null,
        selectedCard: null,
        highlightedMoves: [],
        hoveredPosition: null,
        animatingMove: null,
    });

    const currentStageConfig = getTutorialStageByName(currentStage);

    const resetUIState = () => {
        setUIState({
            selectedPiece: null,
            selectedCard: null,
            highlightedMoves: [],
            hoveredPosition: null,
            animatingMove: null,
        });
    };

    // Handle piece selection with validation
    const handlePieceSelect = (pos: Position, piece: Piece | null) => {
        // Only allow if tutorial allows it
        if (!isActionAllowed("piece_select", currentStage)) {
            return;
        }

        // If trying to move to a highlighted position (only after card is selected)
        if (piece === null || (piece && state.currentPlayer !== piece.player)) {
            const isHighlightedPos = uiState.highlightedMoves.some((p) => {
                return p.col === pos.col && p.row === pos.row;
            });

            if (!isHighlightedPos) return;

            const { selectedPiece, selectedCard } = uiState;
            if (!selectedCard) return;
            if (!selectedPiece) return;

            // Check if this is a valid action for current stage
            const isValidMove = true; // We only get here if it's highlighted
            const actionValid = validateTutorialAction("move", currentStage, {
                from: selectedPiece,
                to: pos,
                isValidMove,
            });

            if (!actionValid) {
                return;
            }

            dispatch({
                type: "move_piece",
                from: selectedPiece,
                to: pos,
                cardUsed: selectedCard,
            });

            setUIState((state) => {
                return {
                    ...state,
                    selectedCard: null,
                    selectedPiece: null,
                    highlightedMoves: [],
                };
            });

            // Mark stages that end with a move as complete
            if (currentStage === "move_piece" || currentStage === "win_condition") {
                setStageComplete(true);
            }
            return;
        }

        // Try to select a piece - validate the action
        const actionValid = validateTutorialAction("piece_select", currentStage, {
            piece,
            player: piece.player,
        });

        if (!actionValid) {
            return;
        }

        // Piece selection successful
        setUIState((state) => {
            return { ...state, selectedPiece: pos };
        });

        // In stage 1 (select_piece), complete the stage immediately after selecting a piece
        if (currentStage === "select_piece") {
            setStageComplete(true);
        }

        // In stage 4 (card_rotation), complete when a blue piece is selected
        if (currentStage === "card_rotation") {
            setStageComplete(true);
        }
    };

    // Handle card selection with validation
    const handleMovecardSelect = (card: MovementCard, player: Player) => {
        // Only allow if tutorial allows it
        if (!isActionAllowed("card_select", currentStage)) {
            return;
        }

        // Only red (human) player can select cards
        if (player !== "red") {
            return;
        }

        // Validate the card selection action
        const actionValid = validateTutorialAction("card_select", currentStage, {
            card,
            player,
        });

        if (!actionValid) {
            return;
        }

        setUIState((state) => {
            return { ...state, selectedCard: card };
        });

        // In stage 2 (select_card), complete the stage immediately after selecting a card
        if (currentStage === "select_card") {
            setStageComplete(true);
        }
    };

    // Calculate valid moves when piece and card are selected
    useEffect(() => {
        const { selectedPiece, selectedCard } = uiState;
        if (selectedPiece && selectedCard) {
            const validMoves = getValidMoves(
                state.board,
                selectedPiece,
                selectedCard,
                state.currentPlayer
            );

            return setUIState((state) => {
                return { ...state, highlightedMoves: validMoves };
            });
        }
    }, [uiState.selectedPiece, uiState.selectedCard, state.board]);

    // Auto-advance to next stage
    const handleNextStage = () => {
        const nextStage = getNextTutorialStage(currentStage);
        if (nextStage) {
            setCurrentStage(nextStage);
            setStageComplete(false);
            // Reset all UI state for the new stage
            resetUIState();
        }
    };

    const isTutorialComplete = currentStage === "completed";

    return (
        <div>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h4">{currentStageConfig?.title}</Typography>
                <Alert severity="info">{currentStageConfig?.description}</Alert>
                <Card sx={{ bgcolor: "background.paper", borderLeft: "4px solid #1976d2" }}>
                    <CardContent>
                        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                            💡 {currentStageConfig?.hint}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Stage progress */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="textSecondary">
                        Stage {TUTORIAL_STAGES.findIndex((s) => s.name === currentStage) + 1} of{" "}
                        {TUTORIAL_STAGES.length}
                    </Typography>
                    {stageComplete && !isTutorialComplete && (
                        <Button variant="contained" onClick={handleNextStage}>
                            Next Stage →
                        </Button>
                    )}
                </Box>
            </Stack>

            {!isTutorialComplete ? (
                <GameBoard
                    style={{
                        margin: "2rem 0",
                        opacity: isTutorialComplete ? 0.5 : 1,
                    }}
                    onPieceSelect={handlePieceSelect}
                    onMoveCardSelect={handleMovecardSelect}
                    state={state}
                    dispatcher={dispatch}
                    reducer={reducer}
                    uiState={uiState}
                />
            ) : (
                <Card sx={{ mt: 4, mb: 4, p: 3, textAlign: "center", bgcolor: "#e8f5e9" }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        🎉 Tutorial Complete!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        You've learned the basics of Onitama. You can now:
                    </Typography>
                    <Box sx={{ textAlign: "left", display: "inline-block", mb: 2 }}>
                        <Typography component="div">• Select and move your pieces</Typography>
                        <Typography component="div">• Use movement cards strategically</Typography>
                        <Typography component="div">• Understand the two win conditions</Typography>
                        <Typography component="div">• Play against the AI opponent</Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "center", mt: 3 }}>
                        <Link to="/play" style={{ textDecoration: "none" }}>
                            <Button variant="contained" size="large">
                                Play Full Game
                            </Button>
                        </Link>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button variant="outlined" size="large">
                                Back to Menu
                            </Button>
                        </Link>
                    </Stack>
                </Card>
            )}
        </div>
    );
}

export default TutorialGamePage;
