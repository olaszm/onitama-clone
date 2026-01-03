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
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "empty", "empty", "empty"],
            ["empty", "empty", "rp", "empty", "empty"],
        ];

        const boardGenerator = new BoardGenerator(boardRep)
        const b = boardGenerator.board
        const game = new Board("red", b, MOVES.filter(v => v.name === "mantis" || v.name === "tiger"));
        dispatch({ type: 'SET_GAME_INSTANCE', payload: game })
        dispatch({ type: "START_GAME" });
        tutorial.start()
    }, []);

    const steps: TutorialStep[] = [
        {
            target: '.grid',
            title: 'The board',
            content: 'This is the board here',
            placement: 'left'
        },
        {
            target: '.grid',
            title: 'The pieces',
            content: 'These are the moves you can choose between',
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
                            showNextCard={false}
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
