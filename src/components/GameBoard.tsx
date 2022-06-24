import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { MoveCard, Position } from "../types/index";
import { Cell } from '../classes/CellClass'
import { Board } from '../classes/BoardClass'

import MoveCardElement from "./MoveCardElement";
import { Container, Grid } from "@mui/material";
import { alphabeta } from "../utils";
import { cloneDeep } from "lodash";

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
	const gameInstance: Board | undefined = state

	const move = (from: Position, to: Position, moveCrd: MoveCard) => {
		dispatcher({ type: "SELECT", payload: from });
		dispatcher({ type: "SELECT_MOVE_CARD", payload: moveCrd });
		dispatcher({ type: "SELECT", payload: to });
	};

	const renderMoveCards = (cards: MoveCard[], side: "red" | "blue") => {
		const gameInstance: Board = state
		let selectedMoveCardName = gameInstance.selectedMove ? gameInstance.selectedMove.name : '' 

		return cards.map((card: MoveCard, idx: number) => {
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
		return 

		// if (state.currentPlayer === "blue") {
		// 	let statecopy = cloneDeep(state);
		// 	setTimeout(() => {
		// 		let bestScore = alphabeta(
		// 			statecopy,
		// 			3,
		// 			-Infinity,
		// 			Infinity,
		// 			true,
		// 			reducer
		// 		);
		// 		let bestMove = bestScore[0];

		// 		dispatcher({ type: "SELECT", payload: bestMove[0] });
		// 		dispatcher({ type: "SELECT_MOVE_CARD", payload: bestMove[1] });
		// 		dispatcher({ type: "SELECT", payload: bestMove[2] });
		// 	}, 250);
		// }
	}, [state?.currentPlayer]);

	if(!gameInstance) return <div></div>

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

					{/* <button onClick={() => dispatcher({type: 'SWAP_MOVE_CARDS'})}>Swap cards</button> */}
				</Container>
				<div style={{ width: "100%" }}>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(gameInstance.bluePlayerMoveCards, "blue")}
					</Grid>
					<div className="grid">{renderCells(gameInstance.board)}</div>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(gameInstance.redPlayerMoveCards, "red")}
						<Grid
							item
							sx={{
								display: { xs: "flex", sm: "flex", md: "none" },
							}}
						>
							{gameInstance.rotatingCard && 
								<MoveCardElement
									isMuted={true}
									isActive={false}
									move={gameInstance.rotatingCard}
								/>
							}
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default GameBoard;
