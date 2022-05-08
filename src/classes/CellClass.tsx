// import { Piece, Position } from "../types";

type TShrine = false | { side: "red" | "blue" };

export class CellFactory {
	constructor() {}
	createCell({
		piece,
		isShrine = false,
		isValid = false,
	}: {
		piece: undefined | { type: "king" | "pawn"; side: "red" | "blue" };
		isShrine?: false | { side: "red" | "blue" };
		isValid?: boolean;
	}): Cell {
		if (!piece) {
			return new Cell(isShrine, isValid, 0);
		} else {
			let p = new Piece(piece.side, piece.type);
			return new Cell(isShrine, isValid, p);
		}
	}
}

export class Cell {
	private isShrine: TShrine;
	private isValid: boolean;
	private piece: 0 | Piece;
	constructor(isShrine: TShrine, isValid: boolean, piece: Piece | 0) {
		this.isShrine = isShrine;
		this.piece = piece;
		this.isValid = isValid;
	}

	getIsShrine(): TShrine {
		return this.isShrine;
	}

	getIsValid(): boolean {
		return this.isValid;
	}

	get _piece(): undefined | Piece {
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
