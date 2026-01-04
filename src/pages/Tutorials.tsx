import { Stack } from "@mui/material";
import { useReducer, useEffect } from "react";
import { Board, IBoardReprGrid, } from "../classes/BoardClass";
import { BoardGenerator } from "../classes/BoardGenerator";
import Section from "../components/AboutPage/Section";
import GameBoard from "../components/GameBoard";
import { Tutorial } from "../components/Tutorial";
import { MOVES } from "../constants";
import { TutorialProvider } from "../context/TutorialContect";
import { useTutorial } from "../hooks/useTutorial";
import { reducer } from "../reducers/originalReducer";
import { TutorialStep } from "../types";

function Tutorials() {
    const [state, dispatch] = useReducer(reducer, undefined);

    useEffect(() => {
        const boardRep: IBoardReprGrid = [
            ["empty", "empty", "bs", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "rp", "rks", "rp", "empty"],
        ];

        const boardGenerator = new BoardGenerator(boardRep)
        const b = boardGenerator.board
        const game = new Board("red", b, MOVES);
        dispatch({ type: 'SET_GAME_INSTANCE', payload: game })
        dispatch({ type: "START_GAME" });
        tutorial.start()
    }, []);

    const steps: TutorialStep[] = [
        {
            target: '.grid',
            title: 'The board',
            content: 'Onimata is played on a 5x5 board.',
            placement: 'left'
        },
        {
            target: '[data-tour="red_pawn"]',
            title: 'The pawn',
            content: 'These are the pawns, you can use these to capture enemy pawns and defeat the enemys king',
            placement: 'top'
        },
        {
            target: '[data-tour="red_king"]',
            title: 'The King',
            content: '',
            placement: 'top'
        },
        {
            target: '[data-tour="player-move-cards"]',
            title: 'The move cards',
            content: 'These are the move cards, these determine how you can move your pieces on the board. Select one of these and select a piece on the board to highlight the available moves on the board.',
            placement: 'top'
        },
        {
            target: '[data-tour="rotating-card"]',
            title: 'The rotating card',
            content: 'Here you can see the next card. Whenever a player uses one of their move card, it will be replaced with this card, this way the 5 move card will rotate between the players during the game.',
            placement: 'top'
        },
        {
            target: 'blue_shrine',
            title: 'Enemy shrine',
            content: 'Capture the enemy shrine with any of your pieces to win the game!',
            placement: 'top'
        },
    ]
    const tutorial = useTutorial(steps)

    return (
        <TutorialProvider>
            <div>
                <Stack spacing={2}>
                    <Section title="Tutorials">
                        How to move
                        <p data-tour="welcome">Hello there</p>
                        <GameBoard
                            style={{
                                margin: "2rem 0",
                            }}
                            state={state}
                            dispatcher={dispatch}
                            reducer={reducer}
                            showBlueMoveCards={false}
                            showNextCard={true}
                        />
                    </Section>
                </Stack>
                <Tutorial
                    steps={steps}
                    isActive={tutorial.isActive}
                    currentStep={tutorial.currentStep}
                    onNext={tutorial.next}
                    onPrev={tutorial.prev}
                    onSkip={tutorial.skip}
                />
            </div>
        </TutorialProvider>
    );
}

export default Tutorials;
