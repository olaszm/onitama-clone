import React, { useState, useReducer, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { List, ListItem } from "@mui/material";
import { Board, IBoardReprGrid, } from "../classes/BoardClass";
import { BoardGenerator } from "../classes/BoardGenerator";
import { reducer } from "../reducers/originalReducer";
import GameOverModal from "../components/GameOverModal";
import SettingsModal from "../components/SettingsModal";

import SettingsIcon from "@mui/icons-material/Settings";

function GamePage() {
	const [state, dispatch] = useReducer(reducer, undefined);
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
							dispatch({
								type: "RESET_GAME",
							});
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
				isOpen={state?.isGameOver ?? false}
				winner={state?.currentPlayer}
				handleClose={() => {
					dispatch({
						type: "RESET_GAME",
					});
				}}
			></GameOverModal>
		</div>
	);
}

export default GamePage;