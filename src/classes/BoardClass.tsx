import { MOVES } from "../constants";
import { MoveCard, Position } from "../types";
import { randomGenerator } from "../utils/helpers";
import { Cell, Piece } from "./CellClass";

const cellFactory = (
	isShrine?: false | { side: "red" | "blue" },
	type?: "pawn" | "king",
	side?: "red" | "blue"
) => {
	if (side && type && isShrine !== undefined) {
		return new Cell(isShrine, false, new Piece(side, type));
	}

	return new Cell(false, false, 0);
};

const initialBoard: Array<Array<Cell>> = [
	[
		cellFactory(false, "pawn", "blue"),
		cellFactory(false, "pawn", "blue"),
		cellFactory({ side: "blue" }, "king", "blue"),
		cellFactory(false, "pawn", "blue"),
		cellFactory(false, "pawn", "blue"),
	],
    new Array(5).fill(cellFactory()),
    new Array(5).fill(cellFactory()),
    new Array(5).fill(cellFactory()),
    [
		cellFactory(false, "pawn", "red"),
		cellFactory(false, "pawn", "red"),
		cellFactory({ side: "red" }, "king", "red"),
		cellFactory(false, "pawn", "red"),
		cellFactory(false, "pawn", "red"),
	],
];

export class Board {
	board: Array<Array<Cell>>;
	currentPlayer: 'red' | 'blue'
	moveCards?: Array<MoveCard>
	selectedMoveCard: MoveCard | undefined
	rotatingCard: MoveCard


	constructor(moveCards?: Array<MoveCard>) {
		this.board = initialBoard;
		this.currentPlayer = 'red'
		this.moveCards = moveCards || randomGenerator(MOVES).slice(0,5)
		this.selectedMoveCard = undefined
		this.rotatingCard = this.moveCards[0]
	}

	getBoard(): Array<Array<Cell>> {
		return this.board;
	}

	getCell(pos:Position): Cell {
        if(this.isValidCell(pos)) return this.board[pos.x][pos.y]

        throw new Error("Invalid position");
    }

	getMoveCards() {
		return this.moveCards
	}

	getSelectedMoveCard(): undefined | MoveCard {
		return this.selectedMoveCard
	}

	setSelectedMoveCard(move: MoveCard) {
		this.selectedMoveCard = move
	}


    isValidCell(pos: Position): boolean {
        try {
            let cell = this.board[pos.x][pos.y]
            return true
        } catch(err) {
            return false
        }

    }

	resetBoard() {
		this.board = initialBoard
	}

}
