import React from "react";
import { CardCell } from "./CardCell";

export function CardRow({
	row,
	x,
	isActive,
}: {
	row: Number[];
	x: Number;
	isActive: boolean;
}) {
	return (
		<div className="card_row">
			{row.map((value, y) => {
				return (
					<CardCell
						isActive={isActive}
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
