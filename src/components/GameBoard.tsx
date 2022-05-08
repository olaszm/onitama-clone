import React, { useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, MoveCard } from "../types/index";
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

	const move = (from: Position, to: Position, moveCrd: MoveCard) => {
		dispatcher({ type: "SELECT", payload: from });
		dispatcher({ type: "SELECT_MOVE_CARD", payload: moveCrd });
		dispatcher({ type: "SELECT", payload: to });
	}


	const renderMoveCards = (cards: MoveCard[], side: "red" | "blue") => {
		let selectedMoveCardName = state.selectedMoveCard
			? state.selectedMoveCard.name
			: "";

		return cards.map((card: MoveCard, idx: number) => {
			return (
				<Grid
					item
					key={idx}
					onClick={() => {
						if (state.currentPlayer === side) {
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
		return board.map((item, y) => {
			return (
				<React.Fragment key={y}>
					{item.map((i, x) => {
						let { selectedCell } = state;

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
		dispatcher({ type: "START_GAME" });
	}, [dispatcher]);

	useEffect(() => {
		if (state.currentPlayer === "blue") {
			let statecopy = cloneDeep(state);
			setTimeout(() => {
				let bestScore = alphabeta(
					statecopy,
					3,
					-Infinity,
					Infinity,
					true,
					reducer
				);
				let bestMove = bestScore[0];
				
				dispatcher({ type: "SELECT", payload: bestMove[0] });
				dispatcher({ type: "SELECT_MOVE_CARD", payload: bestMove[1] });
				dispatcher({ type: "SELECT", payload: bestMove[2] });
			}, 250);
		}

	}, [state.currentPlayer]);

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
						move={state?.rotatingCard}
					/>
				</Container>
				<div style={{ width: "100%" }}>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(state.blueMoveCards, "blue")}
					</Grid>
					<div className="grid">{renderCells(state.gameBoard)}</div>
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						spacing={1}
					>
						{renderMoveCards(state.redMoveCards, "red")}
						<Grid
							item
							sx={{
								display: { xs: "flex", sm: "flex", md: "none" },
							}}
						>
							<MoveCardElement
								isMuted={true}
								isActive={false}
								move={state?.rotatingCard}
							/>
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default GameBoard;
