import { MOVES } from "../constants";
import { MoveCard, Position } from "../types";
import { flipMoveCard, randomGenerator } from "../utils";
// import { randomGenerator } from "../utils/helpers";
import { Cell, CellFactory, Piece } from "./CellClass";

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
		this._board = board;
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
		return this;
	}

	swapCurrentPlayers() {
		this.currentPlayer = this.currentPlayer === "red" ? "blue" : "red";
	}

	setSelectedMove(moveCard: MoveCard): void {
		this.selectedMove = moveCard;
	}

	getAvailableCells(): Cell[] {
		throw new Error("Not implemented");
	}

	swapRotatingCards(): void {
		if(!this.selectedMove) { 
			return 
		} 

		const currentPlayer = this._currentPlayer
		let temp = this.rotatingCard
		this.rotatingCard = this.selectedMove
		
		if(currentPlayer == 'red') {
			this.redPlayerMoveCards = this.redPlayerMoveCards.map(item => {
				if(item.name === this.selectedMove?.name){
					item = temp
				}
				return item
			})
		}

		if(currentPlayer == 'blue') {
			this.redPlayerMoveCards = this.redPlayerMoveCards.map(item => {
				if(item.name === this.selectedMove?.name){
					item = temp
				}
				return item
			})
		}

		this.selectedMove = undefined
	}

	private _shuffleRotatingCards(): void {
		let shuffledMoves: MoveCard[] = randomGenerator(this._possibleMoves);

		this.redPlayerMoveCards = shuffledMoves.slice(0, 2);
		this.bluePlayerMoveCards = shuffledMoves
			.slice(2, 4)
			.map((card: MoveCard) => flipMoveCard(card));
		this.rotatingCard = shuffledMoves[4];
	}

	selectPiece({ position }: { position: Position }): void {
		let targetPiece = this.getCellByPosition(position.x, position.y);
		console.log(targetPiece);
		let currentPiece = this.selectedCell
			? this.getCellByPosition(this.selectedCell.x, this.selectedCell.y)
			: undefined;

		if(targetPiece._piece && targetPiece._piece.side === this._currentPlayer) {
			this.selectedCell = position;
			return
		}

	}

	isCellValidMove(): boolean {
		throw new Error("Not implemented");
	}

	takeEnemyPiece(): void {}

	_isGameOver(): boolean {
		throw new Error("Not implemented");
	}

	getCellByPosition(x: number, y: number): Cell {
		try {
			return this.board[x][y];
		} catch (error) {
			throw new Error("Out of bound");
		}
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
