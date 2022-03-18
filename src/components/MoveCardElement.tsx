import React from "react";
import "../styles/moveCard.css";
import { MoveElementProp } from "../types";
import { CardRow } from "./MoveCard/CardRow";

function MoveCardElement({ isActive, move }: MoveElementProp) {
	if (!move) return null;

	const renderGrid = () => {
		return move.moves.map((el, x) => {
			return <CardRow row={el} isActive={isActive} x={x} key={x} />;
		});
	};

	return (
		<div className="card">
			<div>{renderGrid()}</div>
			<span> {move.name} </span>
		</div>
	);
}

export default MoveCardElement;
