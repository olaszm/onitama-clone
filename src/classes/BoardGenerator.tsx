import { Cell, CellFactory } from "./CellClass";
import { IBoardReprGrid, IBoardReprString } from "./BoardClass";


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
