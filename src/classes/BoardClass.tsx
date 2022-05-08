import { MOVES } from "../constants";
import { MoveCard, Position } from "../types";
// import { randomGenerator } from "../utils/helpers";
import { Cell, CellFactory, Piece } from "./CellClass";

interface IBoard {
	currentPlayer: "red" | "blue";
	isGameOver: boolean;
	selectedMove: undefined | MoveCard;
	board: Cell[][];
	redPlayerMoveCards: MoveCard[]
	bluePlayerMoveCards: MoveCard[]
	rotatingCard: MoveCard
}

export class Board implements IBoard {
	private _currentPlayer: "red" | "blue";
	isGameOver: boolean;
	selectedMove: MoveCard | undefined;
	private _board: Cell[][];
	private _cellFactory: CellFactory;
	redPlayerMoveCards: MoveCard[];
	bluePlayerMoveCards: MoveCard[];
	rotatingCard: MoveCard;


	constructor(
		currentPlayer: "red" | "blue",
		factoryClass: typeof CellFactory
	) {
		this._cellFactory = new factoryClass();
		this._currentPlayer = currentPlayer;
		this.isGameOver = false;
		this.selectedMove = undefined;
		this._board = this._setUpBoard();
		this.redPlayerMoveCards = []
		this.bluePlayerMoveCards = []
		this.rotatingCard = {name: 'monkey' , moves: []}
	}


	public get currentPlayer(): "red" | "blue" {
		return this._currentPlayer;
	}

	public set currentPlayer(value: "red" | "blue") {
		this._currentPlayer = value;
	}

	public get board(): Cell[][] {
		return this._board;
	}
	public set board(value: Cell[][]) {
		this._board = value;
	}

	swapCurrentPlayers() {
		this.currentPlayer = this.currentPlayer === "red" ? "blue" : "red";
	}

	setSelectedMove(moveCard: MoveCard): void {
		this.selectedMove = moveCard;
	}

	_setUpBoard(): Cell[][] {
		const emptyCells = (): Cell[] => {
			return new Array(5).fill(
				this._cellFactory.createCell({
					piece: undefined,
				})
			);
		};

		return [
			[
				this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "blue", type: "king" },
					isShrine: { side: "blue" },
				}),
				this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
				}),
			],
			emptyCells(),
			emptyCells(),
			emptyCells(),
			[
				this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "red", type: "king" },
					isShrine: { side: "red" },
				}),
				this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
				}),
				this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
				}),
			],
		];
	}


	getCellByPosition(x: number, y: number): Cell {
		try {
			return this.board[x][y]
		} catch (error) {
			throw new Error('Out of bound')	
		}
	}
}
