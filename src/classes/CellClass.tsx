// import { Piece, Position } from "../types";

export class Cell {
	isShrine: false | { side: "red" | "blue" };
	isValid: boolean;
	piece: 0 | Piece;
	constructor(
		isShrine: false | { side: "red" | "blue" },
		isValid: boolean,
		piece: Piece | 0
	) {
		this.isShrine = isShrine;
		this.piece = piece;
		this.isValid = isValid;
	}

	getisShrine(): false |  { side: "red" | "blue" } {
		return this.isShrine;
	}

	getIsValid(): boolean {
		return this.isValid;
	}

	getPiece(): undefined | Piece {
		if (!this.piece) {
			return undefined;
		}

		return this.piece;
	}
}

export class Piece {
	side: "red" | "blue";
	type: "pawn" | "king";

	constructor(side: "red" | "blue", type: "pawn" | "king") {
		this.side = side;
		this.type = type;
	}
}
