import { Paper } from "@mui/material";
import React from "react";
import "../styles/moveCard.css";
import { MoveElementProp } from "../types";
import { CardRow } from "./MoveCard/CardRow";

function MoveCardElement({ isActive, isMuted = false, move }: MoveElementProp) {
	if (!move) return null;

	const renderGrid = () => {
		return move.moves.map((el, x) => {
			return <CardRow row={el} x={x} key={x} />;
		});
	};

	let classNames = isActive ? "card card__highlight" : "card";
	classNames = isMuted ? classNames + " card__muted" : classNames;


	return (
		<Paper className={classNames} elevation={1}>
			<div>{renderGrid()}</div>
			<span> {move.name} </span>
		</Paper>
	);
}

export default MoveCardElement;
