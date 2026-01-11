import { Stack } from "@mui/material";
import { useReducer, useEffect, useState } from "react";
import { generateBoard } from "../classes/BoardGenerator";
import Section from "../components/AboutPage/Section";
import GameBoard from "../components/GameBoard";
import { Tutorial } from "../components/Tutorial";
import { TutorialProvider } from "../context/TutorialContext";
import { useTutorial } from "../hooks/useTutorial";
import { reducer } from "../reducers/originalReducer";
import { GameState, MovementCard, Piece, PieceAliasGrid, Player, Position, TutorialStep, UIState } from "../types";
import { dealCards, getValidMoves, selectRandomCards } from "../utils/cards";

function Tutorials() {
    const getInitBoard = () => {
        const boardRepTwo: PieceAliasGrid = [
            ["bp", "bp", "bk", "bp", "bp"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["rp", "rp", "rk", "rp", "rp"],
        ];

        const board = generateBoard(boardRepTwo)
        return board
    }

    const { red, blue, side } = dealCards(selectRandomCards())
    const initialGameState: GameState = {
        board: getInitBoard(),
        currentPlayer: "red",
        playerCards: {
            red: red,
            blue: blue,
        },
        sideCard: side,
        winner: null,
        winCondition: null,
        difficulty: "Medium"
    }

    const [state, dispatch] = useReducer(reducer, initialGameState);

    const steps: TutorialStep[] = [
        {
            target: '.grid',
            title: 'The board',
            content: 'Onimata is played on a 5x5 board.',
            placement: 'left',
        },
        {
            target: '[data-tour="player-move-cards"]',
            title: 'The move cards',
            content: 'These are the move cards, these determine how you can move your pieces on the board. Select one of these first.',
            placement: 'top',
        },
        {
            target: '.grid',
            title: 'The pieces',
            content: 'Select any of your pieces',
            placement: 'top',
        },
        // {
        //     target: '[data-tour="valid_cell"]',
        //     title: 'The pawn',
        //     content: 'These are the pawns, you can use these to capture enemy pawns and defeat the enemys king',
        //     placement: 'top',
        // },
        // {
        //     target: '[data-tour="red_king"]',
        //     title: 'The King',
        //     content: '',
        //     placement: 'top',
        // },
        // {
        //     target: '[data-tour="rotating-card"]',
        //     title: 'The rotating card',
        //     content: 'Here you can see the next card. Whenever a player uses one of their move card, it will be replaced with this card, this way the 5 move card will rotate between the players during the game.',
        //     placement: 'top',
        // },
        // {
        //     target: '.blue_shrine',
        //     title: 'Enemy shrine',
        //     content: 'Capture the enemy shrine with any of your pieces to win the game!',
        //     placement: 'bottom',
        // },
    ]
    // UI state is local component state
    const [uiState, setUIState] = useState<UIState>({
        selectedPiece: null,
        selectedCard: null,
        highlightedMoves: [],
        hoveredPosition: null,
        animatingMove: null
    });
    const tutorial = useTutorial(steps, uiState)


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


    const { selectedPiece, selectedCard } = uiState;

    useEffect(() => {
        const b = getInitBoard()
        tutorial.start()
    }, []);


    useEffect(() => {
        if (!selectedPiece || !selectedCard) {
            return;
        }

        const validMoves = getValidMoves(
            state.board,
            selectedPiece,
            selectedCard,
            state.currentPlayer
        );

        setUIState(prev => ({
            ...prev,
            highlightedMoves: validMoves
        }));
    }, [selectedPiece, selectedCard, state.board, state.currentPlayer]);

    return (
        <TutorialProvider>
            <div>
                <Stack spacing={2}>
                    <Section title="Tutorials">
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
                    </Section>
                </Stack>
                <Tutorial
                    steps={steps}
                    isActive={tutorial.isActive}
                    currentStep={tutorial.currentStep}
                    currentStepData={tutorial.currentStepData}
                    onNext={tutorial.next}
                    onPrev={tutorial.prev}
                    onSkip={tutorial.skip}
                />
            </div>
        </TutorialProvider>
    );
}

export default Tutorials;
