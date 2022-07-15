import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { TMoveCard } from "../types/index";
import { Cell } from "../classes/CellClass";
import { Board } from "../classes/BoardClass";

import MoveCardElement from "./MoveCardElement";
import { Container, Grid } from "@mui/material";
import { alphabeta } from "../utils";

const flexContainerStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "2rem",
	width: "100%%",
	margin: "0 auto",
};

function GameBoard({
	state,
	dispatcher,
	reducer,
	style,
}: {
	state: any;
	reducer: any;
	dispatcher: any;
	style: any;
}) {
	const gameInstance: Board | undefined = state;

	const renderMoveCards = (cards: TMoveCard[], side: "red" | "blue") => {
		const gameInstance: Board = state;
		let selectedMoveCardName = gameInstance.selectedMove
			? gameInstance.selectedMove.name
			: "";

		return cards.map((card: TMoveCard, idx: number) => {
			return (
				<Grid
					item
					key={idx}
					onClick={() => {
						if (gameInstance.currentPlayer === side) {
							dispatcher({
								type: "SELECT_MOVE_CARD",
								payload: card,
							});
						}
					}}
				>
					<MoveCardElement
						isActive={selectedMoveCardName === card.name}
						move={card}
					/>
				</Grid>
			);
		});
	};

	const renderCells = (board: Cell[][]) => {
		let { selectedCell } = state;

		return board.map((item, x) => {
			return (
				<React.Fragment key={x}>
					{item.map((i, y) => {
						return (
							<GameCell
								isSelected={
									!selectedCell
										? false
										: selectedCell.x === x &&
										  selectedCell.y === y
										? true
										: false
								}
								key={`${x}-${y}`}
								position={{ x, y }}
								piece={i}
								handleClick={(pos) =>
									dispatcher({ type: "SELECT", payload: pos })
								}
							/>
						);
					})}
				</React.Fragment>
			);
		});
	};

	useEffect(() => {
		if (!state) return;
		if(state.currentPlayer === 'red') return
		
		const isMaximizingPlayer = state.currentPlayer === "blue";
		let bestScore = alphabeta(
			state,
			2,
			-Infinity,
			Infinity,
			isMaximizingPlayer
		);

		let bestMove = bestScore[0];
		
		setTimeout(() => {
				dispatcher({ type: "MOVE", payload: bestMove });
		}, 150)
	}, [state?.currentPlayer]);

	if (!gameInstance) return <div></div>;

	return (
		<div style={style}>
			<div style={flexContainerStyle}>
				<Container
					style={{ flex: "1" }}
					sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
				>
					<MoveCardElement
						isMuted
						isActive={false}
						move={gameInstance.rotatingCard}
					/>
				</Container>
				<div style={{ width: "100%" }}>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(
							gameInstance.bluePlayerMoveCards,
							"blue"
						)}
					</Grid>
					<div className="grid">
						{renderCells(gameInstance.board)}
					</div>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(
							gameInstance.redPlayerMoveCards,
							"red"
						)}
						<Grid
							item
							sx={{
								display: { xs: "flex", sm: "flex", md: "none" },
							}}
						>
							{gameInstance.rotatingCard && (
								<MoveCardElement
									isMuted={true}
									isActive={false}
									move={gameInstance.rotatingCard}
								/>
							)}
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default GameBoard;
