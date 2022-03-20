import React from "react";
import { CardCell } from "./CardCell";

export function CardRow({
	row,
	x,
}: {
	row: Number[];
	x: Number;
}) {
	return (
		<div className="card_row">
			{row.map((value, y) => {
				return (
					<CardCell
						key={y}
						x={x}
						y={y}
						value={value}
					/>
				);
			})}
		</div>
	);
}
