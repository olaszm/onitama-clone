import { MOVES } from "../constants";
import { TMoveCard, Position } from "../types";
import {
    createMovesFromData,
    randomGenerator,
    shiftMoveToCurrentPosition,
} from "../utils";
import { Cell, Piece } from "./CellClass";
import { cloneDeep } from "lodash";
import MoveCardC from "./MoveCardClass";

export interface IBoard {
    currentPlayer: "red" | "blue";
    isGameOver: boolean;
    selectedMove: undefined | MoveCardC;
    board: Cell[][];
    redPlayerMoveCards: MoveCardC[];
    bluePlayerMoveCards: MoveCardC[];
    rotatingCard: MoveCardC;
}

export type IBoardReprGrid = Array<Array<keyof typeof IBoardReprString>>;

export enum IBoardReprString {
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
    selectedMove: MoveCardC | undefined;
    selectedCell: Position | undefined;
    private _board: Cell[][];
    private _initBoard: Cell[][];
    private _possibleMoves: MoveCardC[];
    redPlayerMoveCards: MoveCardC[];
    bluePlayerMoveCards: MoveCardC[];
    rotatingCard: MoveCardC;

    constructor(currentPlayer: "red" | "blue", board: Cell[][] = [], moves: TMoveCard[] = MOVES) {
        this._currentPlayer = currentPlayer;
        this.isGameOver = false;
        this.selectedMove = undefined;
        this._possibleMoves = createMovesFromData(moves);
        this._initBoard = cloneDeep(board);
        this._board = cloneDeep(board);
        this.selectedCell = undefined;
        this.redPlayerMoveCards = [];
        this.bluePlayerMoveCards = [];
        this.rotatingCard = this._possibleMoves[0];
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
        this.currentPlayer = "red";
        this._shuffleRotatingCards();
        this._board = cloneDeep(this._initBoard);
        this._resetHighlight();
        return this;
    }

    move(from: Position, to: Position, moveCard: MoveCardC) {
        this.selectCell({ position: from });
        this.setSelectedMove(moveCard);
        this.selectCell({ position: to });

        return this;
    }

    swapCurrentPlayers() {
        this.currentPlayer = this.currentPlayer === "red" ? "blue" : "red";
    }

    setSelectedMove(moveCard: MoveCardC): Board {
        this.selectedMove = moveCard;
        if (this.selectedCell) {
            this._highlightValidCells();
        }

        return this;
    }

    getPiecePositions(): Position[] {
        const pieces = [];
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board.length; x++) {
                const currentPiece = this.getPieceByPosition(x, y);

                if (currentPiece) {
                    pieces.push({ x, y });
                }
            }
        }

        return pieces;
    }

    getAllPiecePositionBySide(side: "red" | "blue"): Position[] {
        return this.getPiecePositions().filter((pos) => {
            const currentPiece = this.getPieceByPosition(pos.x, pos.y);
            if (currentPiece && currentPiece.side === side) {
                return pos;
            }
            return -1
        });
    }

    swapRotatingCards(): void {
        if (!this.selectedMove) {
            return;
        }

        const currentPlayer = this._currentPlayer;
        let temp = this.rotatingCard;

        if (currentPlayer === "red") {
            this.rotatingCard = this.selectedMove;
            this.redPlayerMoveCards = this.redPlayerMoveCards.map((item) => {
                if (item.name === this.selectedMove?.name) {
                    if (temp.isSwapped) {
                        temp.rotateMoves()
                    }

                    item = temp;
                }
                return item;
            });
        }

        if (currentPlayer === "blue") {
            this.rotatingCard = this.selectedMove;
            this.bluePlayerMoveCards = this.bluePlayerMoveCards.map((item) => {
                if (item.name === this.selectedMove?.name) {
                    if (!temp.isSwapped) {
                        temp.rotateMoves()
                    }
                    item = temp;
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
        let shuffledMoves: MoveCardC[] = randomGenerator(this._possibleMoves);

        this.redPlayerMoveCards = shuffledMoves.slice(0, 2);
        this.bluePlayerMoveCards = shuffledMoves
            .slice(2, 4)
            .map((card: MoveCardC) => {
                if (!card.isSwapped) return card.rotateMoves();
                return card;
            });
        this.rotatingCard = shuffledMoves[4];
    }

    selectCell({ position }: { position: Position }): Board {
        const targetCell = this.getCellByPosition(position.x, position.y);

        if (!targetCell) return this;

        if (this.selectedMove && this.selectedCell && targetCell.getIsValid()) {
            const currentPiece = this.getCellByPosition(
                this.selectedCell.x,
                this.selectedCell.y
            );

            if (!currentPiece) return this;

            this.swapPiece(currentPiece, targetCell);
            return this;
        }

        if (targetCell.piece && targetCell.piece.side === this._currentPlayer) {
            this.selectedCell = position;
            this._highlightValidCells();
            return this;
        }

        return this;
    }

    swapPiece(selectedCell: Cell, targetCell: Cell): void {
        if (targetCell.getIsShrine()) {
            const shrine = targetCell.getIsShrine() as { side: "red" | "blue" };
            if (shrine.side !== this.currentPlayer) {
                this.gameOver();
            }
        }

        if (targetCell.piece && targetCell.piece.side !== this._currentPlayer) {
            if (targetCell.piece.type === "pawn") {
                targetCell.piece = selectedCell.piece;
                selectedCell.piece = 0;
            } else if (targetCell.piece.type === "king") {
                targetCell.piece = selectedCell.piece;
                selectedCell.piece = 0;
                this.gameOver();
                return;
            }

            this.swapRotatingCards();
            return;
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

    getValidMoves(
        moveCard: TMoveCard,
        pos: Position,
        side: "red" | "blue"
    ): Position[] {
        const shiftedMoveCard = shiftMoveToCurrentPosition(pos, moveCard.moves);

        const validMovesArray: Position[] = [];
        this._board.forEach((row, x) => {
            row.forEach((cell, y) => {
                if (!cell.piece || (cell.piece && cell.piece.side !== side)) {
                    let isValidMove = this.isValidMove(shiftedMoveCard, {
                        x: y,
                        y: x,
                    });

                    if (isValidMove) {
                        // cell.setIsValid(isValidMove);
                        validMovesArray.push({ x, y });
                    }
                }
            });
        });

        return validMovesArray;
    }

    gameOver(): void {
        this.isGameOver = true;
        this.selectedCell = undefined;
        this.selectedMove = undefined;
        this._resetHighlight();
    }

    getCellByPosition(x: number, y: number): Cell | undefined {
        try {
            return this.board[x][y];
        } catch (error) {
            return undefined;
        }
    }

    getPieceByPosition(x: number, y: number): Piece | 0 | undefined {
        const cell = this.getCellByPosition(x, y);

        if (cell) return cell.piece;

        return cell;
    }
}
