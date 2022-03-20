import React, { useReducer } from "react";
import Container from "@mui/material/Container";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { initialGameState } from "../types";
import { reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";

function GamePage() {
	const [state, dispatch] = useReducer(reducer, initialGameState);

	return (
		<Container>
			<div>
				<Link to="/">
					<Button variant="contained">End Game</Button>
				</Link>
				<Button
					onClick={() => dispatch({ type: "RESET_GAME" })}
					variant="contained"
				>
					Reset
				</Button>
			</div>
			<GameBoard
				style={{
					margin: "2rem 0",
				}}
				state={state}
				dispatcher={dispatch}
			/>
			<GameOverModal
				isOpen={state.isGameOver}
				handleClose={() => {
					dispatch({ type: "RESET_GAME" });
				}}
			></GameOverModal>
		</Container>
	);
}

export default GamePage;
