import React, { useState, useReducer } from "react";
import Container from "@mui/material/Container";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { List, ListItem } from "@mui/material";
import { initialGameState } from "../types";
import { reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";
import SettingsModal from "../components/SettingsModal";

import SettingsIcon from "@mui/icons-material/Settings";

function GamePage() {
	const [state, dispatch] = useReducer(reducer, initialGameState);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<Container>
			<div style={{margin: '0.5rem 0'}}>
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
				state={state}
				dispatcher={dispatch}
				reducer={reducer}
			/>
			<SettingsModal
				isOpen={isSettingsOpen}
				handleClose={() => setIsSettingsOpen(false)}
			>
				<List sx={{ pt: 0 }}>
					<ListItem
						button
						onClick={() => {
							dispatch({ type: "RESET_GAME" })
							setIsSettingsOpen(false)
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
				isOpen={state.isGameOver}
				winner={state.currentPlayer}
				handleClose={() => {
					dispatch({ type: "RESET_GAME" });
				}}
			></GameOverModal>
		</Container>
	);
}

export default GamePage;
