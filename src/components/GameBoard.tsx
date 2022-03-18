import React, { useEffect, useReducer } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, MoveCard, initialGameState } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { reducer } from "../reducers/originalReducer";

const flexContainerStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "2rem",
	width: "85%",
	margin: "0 auto",
};

function GameBoard() {
	const [gameState, dispatch] = useReducer(reducer, initialGameState);

	const renderMoveCards = (cards: MoveCard[], side: "red" | "blue") => {
		let selectedMoveCardName = gameState.selectedMoveCard
			? gameState.selectedMoveCard.name
			: "";

		return cards.map((card: MoveCard, idx: number) => {
			return (
				<div
					key={idx}
					onClick={() => {
						if (gameState.currentPlayer === side) {
							dispatch({
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
				</div>
			);
		});
	};

	const renderCells = (state: Cell[][]) => {
		return state.map((item, y) => {
			return (
				<React.Fragment key={y}>
					{item.map((i, x) => {
						let { selectedCell } = gameState;

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
									dispatch({ type: "SELECT", payload: pos })
								}
							/>
						);
					})}
				</React.Fragment>
			);
		});
	};

	useEffect(() => {
		dispatch({ type: "START_GAME" });
	}, []);

	return (
		<div>
			<div>
				<button onClick={() => dispatch({ type: "RESET_GAME" })}>
					Reset
				</button>
			</div>
			{gameState.isGameOver && (
				<>
					<p>Game over! Winner is {gameState.currentPlayer} </p>
					<button onClick={() => dispatch({ type: "RESET_GAME" })}>
						Reset
					</button>
				</>
			)}
			<div
				style={{
					display: "flex",
					gap: "1em",
					justifyContent: "space-between",
					textAlign: "center",
					margin: "0 auto",
					maxWidth: "200px",
					color: "blue",
				}}
			>
				{renderMoveCards(gameState.blueMoveCards, "blue")}
			</div>
			<div style={flexContainerStyle}>
				<MoveCardElement
					isActive={false}
					move={gameState?.rotatingCard}
				/>
				<div className="grid">{renderCells(gameState.gameBoard)}</div>
			</div>

			<div
				style={{
					display: "flex",
					gap: "1em",
					justifyContent: "space-between",
					textAlign: "center",
					margin: "0 auto",
					maxWidth: "200px",
					color: "red",
				}}
			>
				{renderMoveCards(gameState.redMoveCards, "red")}
			</div>
		</div>
	);
}

export default GameBoard;
