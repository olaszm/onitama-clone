// import { cloneDeep } from "../utils/helpers";
import {cloneDeep} from 'lodash';
import { Board } from "../classes/BoardClass";
import {Cell} from '../classes/CellClass'

export interface InitGameState {
  blueMoveCards: MoveCard[];
  currentPlayer: "red" | "blue";
  gameBoard: Cell[][];
  isGameOver: boolean;
  rotatingCard: MoveCard | undefined;
  redMoveCards: MoveCard[];
  selectedMoveCard: MoveCard | undefined;
  selectedCell: Position | undefined;
  gameInstance: Board | undefined
}

export interface Position {
  x: number;
  y: number;
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
  move: MoveCard | undefined;
}


export const initialGameState: InitGameState = {
  blueMoveCards: [],
  currentPlayer: "red",
  gameBoard: [],
  isGameOver: false,
  rotatingCard: undefined,
  redMoveCards: [],
  selectedCell: undefined,
  selectedMoveCard: undefined,
  gameInstance: undefined
};
