import { Paper } from "@mui/material";
import React from "react";
import "../styles/moveCard.css";
import { MoveElementProp } from "../types";
import { CardRow } from "./MoveCard/CardRow";

function MoveCardElement({ isActive, move }: MoveElementProp) {
	if (!move) return null;

	const renderGrid = () => {
		return move.moves.map((el, x) => {
			return <CardRow row={el} x={x} key={x} />;
		});
	};

	const classNames = isActive ? "card card__highlight" : "card";

	return (
		<Paper className={classNames} variant="outlined" elevation={1}>
			<div>{renderGrid()}</div>
			<span> {move.name} </span>
		</Paper>
	);
}

export default MoveCardElement;
