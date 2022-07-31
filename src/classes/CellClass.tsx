// import { Piece, Position } from "../types";

type TShrine = false | { side: "red" | "blue" };

export class CellFactory {
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
	public piece: 0 | Piece;
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

	setIsValid(val: boolean): void {
		this.isValid = val
		return;
	}

	getPiece(): Piece | 0 {
		return this.piece;
	}

	setPiece(piece: Piece | 0): void {
		this.piece = piece;
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
