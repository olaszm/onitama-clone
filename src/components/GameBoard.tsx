import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { GameState, MovementCard, Player, Piece, Position, UIState } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { Container, Grid } from "@mui/material";
import { getBestMove, posKey } from "../utils";

const flexContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    width: "100%",
    margin: "0 auto",
    flexWrap: "wrap",
};

function GameBoard({
    state,
    dispatcher,
    reducer,
    showRedMoveCards = true,
    showBlueMoveCards = true,
    showNextCard = true,
    style,
    onPieceSelect,
    onMoveCardSelect,
    uiState
}: {
    state: GameState;
    uiState: UIState;
    reducer: any
    dispatcher: any;
    style: any;
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
                <Grid
                    item
                    key={idx}
                    onClick={() => {
                        onMoveCardSelect(card, side)
                    }}
                >
                    <MoveCardElement
                        isSelected={selectedMoveCardName === card.name}
                        card={card}
                        currentPlayer={side}
                        isMuted={side === 'blue'}
                    />
                </Grid>
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
        const bestMove = getBestMove(gameState, 3); // depth=3 for reasonable speed
        if (!bestMove) return gameState;

        return dispatcher(bestMove);
    };

    useEffect(() => {
        if (state.winner) return
        if (state.currentPlayer === 'red') {
            const [firstMoveCard] = state.playerCards.red
            if (!firstMoveCard) return

            onMoveCardSelect(firstMoveCard, state.currentPlayer)
            return
        }

        const timeout = setTimeout(() => {
            makeAIMove(state)
        }, 150)
        return () => {
            clearTimeout(timeout)
        }
    }, [state.currentPlayer, state.winner]);

    if (!gameInstance) return <div></div>;

    return (
        <div style={style}>
            <div style={flexContainerStyle}>
                {showNextCard &&
                    <Container
                        data-tour="rotating-card"
                        style={{ flex: "1", flexDirection: "column" }}
                        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
                    >
                        <p>Next card:</p>
                        <MoveCardElement
                            isSelected={false}
                            card={state.sideCard}
                            currentPlayer={state.currentPlayer}
                            isMuted={true}
                        />
                    </Container>
                }
                <div style={{ width: "100%", flex: 2, maxWidth: "100%", overflow: "hidden" }}>
                    {/* Mobile Next Card - positioned above blue cards */}
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            display: { xs: "flex", sm: "flex", md: "none" },
                            marginBottom: "0.5rem",
                        }}
                    >
                        {state.sideCard && (
                            <div style={{ textAlign: "center" }}>
                                <p style={{ margin: "0 0 0.25rem 0", fontSize: "12px", fontWeight: "bold" }}>Next card:</p>
                                <MoveCardElement
                                    isSelected={false}
                                    card={state.sideCard}
                                    currentPlayer="blue"
                                />
                            </div>
                        )}
                    </Grid>

                    {showBlueMoveCards &&
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            spacing={0.25}
                            sx={{ maxWidth: "100%", flexWrap: "nowrap", overflowX: "hidden" }}
                        >
                            {renderMoveCards(
                                state.playerCards.blue,
                                "blue"
                            )}
                        </Grid>

                    }
                    <div className="grid">
                        {renderBoard(state.board, uiState.selectedPiece)}
                    </div>

                    {showRedMoveCards &&
                        <Grid
                            data-tour="player-move-cards"
                            container
                            justifyContent="center"
                            alignItems="center"
                            spacing={0.25}
                            sx={{ maxWidth: "100%", flexWrap: "nowrap", overflowX: "hidden" }}
                        >
                            {renderMoveCards(
                                state.playerCards.red,
                                "red"
                            )}
                        </Grid>
                    }
                </div>
            </div>
        </div>
    );
}

export default GameBoard;
