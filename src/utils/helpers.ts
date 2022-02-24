import { Position, Cell, MoveCard, Piece } from "../types";
import { cloneDeep } from "lodash";


export const shiftMoveToCurrentPosition = (
  position: Position,
  move: number[][]
): number[][] => {
  let moveCopy = cloneDeep(move) //move.map((arr) => arr.slice());
  let column = position.x - 2;
  let row = position.y - 2;

  if (row > 0) {
    while (row > 0) {
      moveCopy.pop();
      moveCopy.unshift([0, 0, 0, 0, 0]);
      row--;
    }
  } else if (row < 0) {
    while (row < 0) {
      moveCopy.shift();
      moveCopy.push([0, 0, 0, 0, 0]);
      row++;
    }
  }

  if (column < 0) {
    while (column < 0) {
      moveCopy.forEach((array: number[]) => {
        array.shift();
        array.push(0);
      });
      column++;
    }
  } else if (column > 0) {
    while (column > 0) {
      moveCopy.forEach((array: number[]) => {
        array.unshift(0);
        array.pop();
      });
      column--;
    }
  }

  return moveCopy;
};

export const randomGenerator = (array: Array<any>) => {
  return [...array].sort(function () {
    return 0.5 - Math.random();
  });
};

export const getCell = (board: Cell[][], position: Position): Cell => {
  return board[position.y][position.x];
};

export const getPiece = (board: Cell[][], position: Position): Piece | 0 => {
  return board[position.y][position.x].piece || 0
}

export const resetHighlightedCells = (board: Cell[][]) => {
  const boardCopy = cloneDeep(board)

  for (let x = 0; x < boardCopy.length; x++) {
    for (let y = 0; y < boardCopy[x].length; y++) {
      boardCopy[x][y].isValid = false;
    }
  }
  return boardCopy;
};

export const highlightValidMoves = (
  board: Cell[][],
  moveCard: MoveCard,
  selectedCell: Cell,
  pos: Position
): Cell[][] => {
  let boardCopy = cloneDeep(board)
  if (!moveCard) {
    return boardCopy;
  }

  boardCopy = resetHighlightedCells(boardCopy)

  //   // Rotate moveCard to match sides
  if (selectedCell.piece && selectedCell.piece.side === "blue" && moveCard) {
    moveCard.moves = moveCard.moves.map((y) => y.reverse()).reverse();
  }

  // Shift center value to match selected piece
  let shiftedValidCells = shiftMoveToCurrentPosition(
    pos,
    moveCard?.moves || [[]]
  );

  // Highlight valid cells
  for (let x = 0; x < boardCopy.length; x++) {
    for (let y = 0; y < boardCopy[x].length; y++) {
      if (shiftedValidCells[x][y] === 1) {
        boardCopy[x][y].isValid = true;
      }
    }
  }
  return boardCopy;
};


export const swapPieces = (
  board: Cell[][],
  selected: Position,
  target: Position
): void => {
  const currentSelectedPiece = getPiece(board, selected)
  const targetPiece = getPiece(board, target)
  board[selected.y][selected.x].piece = targetPiece
  board[target.y][target.x].piece = currentSelectedPiece
};


export const swapCurrentPlayer = (currentPlayer: 'red' | 'blue') => {
  return currentPlayer === 'red' ? 'blue' : 'red' 
}