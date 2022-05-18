import React, { useState, useReducer, useEffect } from "react";
import Container from "@mui/material/Container";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { List, ListItem } from "@mui/material";
import { initialGameState } from "../types";
import { Board, BoardGenerator, IBoardReprGrid, } from "../classes/BoardClass";
import { Cell} from "../classes/CellClass";
import { reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";
import SettingsModal from "../components/SettingsModal";

import SettingsIcon from "@mui/icons-material/Settings";

function GamePage() {
	const [state, dispatch] = useReducer(reducer, initialGameState);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	useEffect(() => {
		const boardRep:IBoardReprGrid = [
			["bp", "bp", "bks", "bp", "bp"],
			["empty", "empty", "empty", "empty", "empty"],
			["empty", "empty", "empty", "empty", "empty"],
			["empty", "empty", "empty", "empty", "empty"],
			["rp", "rp", "rks", "rp", "rp"],
		];
		const boardGenerator = new BoardGenerator(boardRep)
		const b = boardGenerator.board
		const game = new Board("red", b);
		dispatch({type: 'SET_GAME_INSTANCE', payload: game})
		dispatch({ type: "START_GAME" });
	}, []);

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
							if(state.gameInstance) {
								dispatch({
									type: "RESET_GAME",
								});
							}
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
				isOpen={state.isGameOver}
				winner={state.currentPlayer}
				handleClose={() => {
					if(state.gameInstance) {
						dispatch({
							type: "RESET_GAME",
						});
					}
				}}
			></GameOverModal>
		</div>
	);
}

export default GamePage;
