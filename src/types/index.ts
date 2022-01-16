export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  isShrine: boolean;
  piece: CellType;
  isValid: boolean;
}

export type MoveCard = number[][]

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
