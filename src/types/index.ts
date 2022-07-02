import {Cell} from '../classes/CellClass'


export interface Position {
  x: number;
  y: number;
}


export type TMoveCard = {
  name: string;
  moves: number[][];
};

export type CellType = Piece | 0;

export interface Piece {
  type: "pawn" | "king";
  side: "red" | "blue";
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
  move: TMoveCard | undefined;
}
