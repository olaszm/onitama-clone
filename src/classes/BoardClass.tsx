import { MOVES } from "../constants";
import { MoveCard, Position } from "../types";
import {
	flipMoveCard,
	randomGenerator,
	shiftMoveToCurrentPosition,
} from "../utils";
// import { randomGenerator } from "../utils/helpers";
import { Cell, CellFactory, Piece } from "./CellClass";
import { cloneDeep } from "lodash";

interface IBoard {
	currentPlayer: "red" | "blue";
	isGameOver: boolean;
	selectedMove: undefined | MoveCard;
	board: Cell[][];
	redPlayerMoveCards: MoveCard[];
	bluePlayerMoveCards: MoveCard[];
	rotatingCard: MoveCard;
}

export type IBoardReprGrid = Array<Array<keyof typeof IBoardReprString>>;

enum IBoardReprString {
	"rk",
	"rp",
	"bk",
	"bp",
	"rks",
	"rps",
	"bks",
	"bps",
	"bs",
	"rs",
	"empty",
}

export class Board implements IBoard {
	private _currentPlayer: "red" | "blue";
	isGameOver: boolean;
	selectedMove: MoveCard | undefined;
	selectedCell: Position | undefined;
	private _board: Cell[][];
	private _initBoard: Cell[][];
	private _possibleMoves: MoveCard[];
	redPlayerMoveCards: MoveCard[];
	bluePlayerMoveCards: MoveCard[];
	rotatingCard: MoveCard;

	constructor(currentPlayer: "red" | "blue", board: Cell[][] = []) {
		this._currentPlayer = currentPlayer;
		this.isGameOver = false;
		this.selectedMove = undefined;
		this._possibleMoves = MOVES;
		this._initBoard = board;
		this._board = cloneDeep(board);
		this.selectedCell = undefined;
		this.redPlayerMoveCards = [];
		this.bluePlayerMoveCards = [];
		this.rotatingCard = { name: "monkey", moves: [] };
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

	startGame() {
		this._shuffleRotatingCards();
		return this;
	}

	resetGame(): Board {
		this.isGameOver = false;
		this._shuffleRotatingCards();
		this._board = this._initBoard;
		this._resetHighlight()
		return this;
	}

	swapCurrentPlayers() {
		this.currentPlayer = this.currentPlayer === "red" ? "blue" : "red";
	}

	setSelectedMove(moveCard: MoveCard): void {
		this.selectedMove = moveCard;
		if (this.selectedCell) {
			this._highlightValidCells();
		}
	}

	getAllPiecePositionBySide(side: "red" | "blue"): Position[] {
		let availableCells: Position[] = [];

		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board.length; x++) {
				const currentPiece = this.getPieceByPosition(x, y);
				let isSameColoredPiece =
					currentPiece && currentPiece.side === side;
				if (isSameColoredPiece) {
					availableCells.push({ x, y });
				}
			}
		}

		return availableCells;
	}

	swapRotatingCards(): void {
		if (!this.selectedMove) {
			return;
		}

		const currentPlayer = this._currentPlayer;
		let temp = this.rotatingCard;
		this.rotatingCard = this.selectedMove;

		if (currentPlayer == "red") {
			this.redPlayerMoveCards = this.redPlayerMoveCards.map((item) => {
				if (item.name === this.selectedMove?.name) {
					item = temp;
				}
				return item;
			});
		}

		if (currentPlayer == "blue") {
			this.bluePlayerMoveCards = this.bluePlayerMoveCards.map((item) => {
				if (item.name === this.selectedMove?.name) {
					item = flipMoveCard(temp);
				}
				return item;
			});
		}

		this.selectedMove = undefined;
		this.swapCurrentPlayers();
		this._resetHighlight();
		this.selectedCell = undefined;
	}

	private _shuffleRotatingCards(): void {
		let shuffledMoves: MoveCard[] = randomGenerator(this._possibleMoves);

		this.redPlayerMoveCards = shuffledMoves.slice(0, 2);
		this.bluePlayerMoveCards = shuffledMoves
			.slice(2, 4)
			.map((card: MoveCard) => flipMoveCard(card));
		this.rotatingCard = shuffledMoves[4];
	}

	selectCell({ position }: { position: Position }): void {
		const targetPiece = this.getCellByPosition(position.x, position.y);

		if (
			this.selectedMove &&
			this.selectedCell &&
			targetPiece.getIsValid()
		) {
			const currentPiece = this.getCellByPosition(
				this.selectedCell.x,
				this.selectedCell.y
			);
			this.swapPiece(currentPiece, targetPiece);
			return;
		}

		if (
			targetPiece.piece &&
			targetPiece.piece.side === this._currentPlayer
		) {
			this.selectedCell = position;
			this._highlightValidCells();
			return;
		}
	}

	swapPiece(selectedCell: Cell, targetCell: Cell): void {
		if (targetCell.piece && targetCell.piece.side !== this._currentPlayer) {
			if (targetCell.piece.type === "pawn") {
				targetCell.piece = selectedCell.piece;
				selectedCell.piece = 0;
			} else if (targetCell.piece.type === "king") {
				targetCell.piece = selectedCell.piece;
				selectedCell.piece = 0;
				this.gameOver();
				return
			}

			this.swapRotatingCards();
			return;
		} else if (targetCell.piece === 0 && targetCell.getIsShrine()) {
			const shrine = targetCell.getIsShrine() as { side: "red" | "blue" };
			if (shrine.side !== this.currentPlayer) {
				targetCell.piece = selectedCell.piece;
				selectedCell.piece = 0;
				this.gameOver();
				return;
			}
		}

		let temp = selectedCell.piece;
		selectedCell.piece = targetCell.piece;
		targetCell.piece = temp;

		this.swapRotatingCards();
	}

	_highlightValidCells(): void {
		if (!this.selectedCell || !this.selectedMove) return;

		// Reset board
		this._resetHighlight();

		const shiftedMoveCard = shiftMoveToCurrentPosition(
			this.selectedCell,
			this.selectedMove.moves
		);

		this._board.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (!this.selectedCell) return;

				if (
					!cell.piece ||
					(cell.piece && cell.piece.side !== this._currentPlayer)
				) {
					let isValidMove = this.isValidMove(shiftedMoveCard, {
						y,
						x,
					});
					cell.setIsValid(isValidMove);
				}
			});
		});

		return;
	}

	_resetHighlight(): void {
		this._board.forEach((row, y) => {
			row.forEach((cell, x) => {
				cell.setIsValid(false);
			});
		});
	}

	isValidMove(movecard: Number[][], position: Position): boolean {
		if (movecard[position.y][position.x] === 1) {
			return true;
		}
		return false;
	}

	takeEnemyPiece(): void {}

	_isGameOver(): boolean {
		throw new Error("Not implemented");
	}

	gameOver(): void {
		this.isGameOver = true;
		this.selectedCell = undefined;
		this.selectedMove = undefined
		this._resetHighlight();
	}

	getCellByPosition(x: number, y: number): Cell {
		try {
			return this.board[x][y];
		} catch (error) {
			throw new Error("Out of bound");
		}
	}

	getPieceByPosition(x: number, y: number): Piece | 0 {
		const piece = this.getCellByPosition(x, y).piece;
		return piece;
	}
}

export class BoardGenerator {
	private _cellFactory: CellFactory;
	board: Cell[][];

	constructor(
		boardRep: IBoardReprGrid,
		factoryClass: typeof CellFactory = CellFactory
	) {
		this._cellFactory = new factoryClass();
		this.board = this.createBoard(boardRep);
	}

	createBoard(boardRepr: IBoardReprGrid): Cell[][] {
		const b = boardRepr.map((row, rowIdx) => {
			return row.map((el, elIdx) => {
				return this._parseBoardRepEl(IBoardReprString[el]);
			});
		});
		this.board = b;
		return b;
	}

	private _parseBoardRepEl(el: IBoardReprString): Cell {
		switch (el) {
			case IBoardReprString.rp: {
				return this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
				});
			}
			case IBoardReprString.rk: {
				return this._cellFactory.createCell({
					piece: { side: "red", type: "king" },
				});
			}

			case IBoardReprString.rps: {
				return this._cellFactory.createCell({
					piece: { side: "red", type: "pawn" },
					isShrine: { side: "red" },
				});
			}
			case IBoardReprString.rks: {
				return this._cellFactory.createCell({
					piece: { side: "red", type: "king" },
					isShrine: { side: "red" },
				});
			}
			case IBoardReprString.bp: {
				return this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
				});
			}
			case IBoardReprString.bk: {
				return this._cellFactory.createCell({
					piece: { side: "blue", type: "king" },
				});
			}

			case IBoardReprString.bps: {
				return this._cellFactory.createCell({
					piece: { side: "blue", type: "pawn" },
					isShrine: { side: "blue" },
				});
			}
			case IBoardReprString.bks: {
				return this._cellFactory.createCell({
					piece: { side: "blue", type: "king" },
					isShrine: { side: "blue" },
				});
			}

			case IBoardReprString.rs: {
				return this._cellFactory.createCell({
					piece: undefined,
					isShrine: { side: "red" },
				});
			}

			case IBoardReprString.bs: {
				return this._cellFactory.createCell({
					piece: undefined,
					isShrine: { side: "blue" },
				});
			}
			default:
				return this._cellFactory.createCell({
					piece: undefined,
				});
		}
	}
}
