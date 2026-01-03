import { Stack } from "@mui/material";
import { useReducer, useEffect } from "react";
import { Board, IBoardReprGrid, } from "../classes/BoardClass";
import { BoardGenerator } from "../classes/BoardGenerator";
import Section from "../components/AboutPage/Section";
import GameBoard from "../components/GameBoard";
import { MOVES } from "../constants";
import { reducer } from "../reducers/originalReducer";

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
    }, []);

    return (
        <div>
            <Stack spacing={2}>
                <Section title="Tutorials">
                    How to move
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
        </div>
    );
}

export default Tutorials;
