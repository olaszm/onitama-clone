import { INITIAL_BOARD } from "../constants";
// import { cloneDeep } from "../utils/helpers";
import {cloneDeep} from 'lodash';

export interface InitGameState {
  blueMoveCards: MoveCard[];
  currentPlayer: "red" | "blue";
  gameBoard: Cell[][];
  isGameOver: boolean;
  rotatingCard: MoveCard | undefined;
  redMoveCards: MoveCard[];
  selectedMoveCard: MoveCard | undefined;
  selectedCell: Position | undefined;
}

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  isShrine: Shrine | false;
  piece: CellType;
  isValid: boolean;
}

export type MoveCard = {
  name: string;
  moves: number[][];
};

export type CellType = Piece | 0;

export interface Piece {
  type: "pawn" | "king";
  side: "red" | "blue";
}

interface Shrine {
  side: 'red' | "blue"
}

export type CellProps = {
  handleClick: (position: Position) => void;
  isSelected: boolean;
  position: Position;
  piece: Cell;
};


export type MoveElementProp = {
  isActive: boolean;
  isMuted?: boolean;
  move: MoveCard;
}


export const initialGameState: InitGameState = {
  blueMoveCards: [],
  currentPlayer: "red",
  gameBoard: cloneDeep(INITIAL_BOARD),
  isGameOver: false,
  rotatingCard: undefined,
  redMoveCards: [],
  selectedCell: undefined,
  selectedMoveCard: undefined,
};
