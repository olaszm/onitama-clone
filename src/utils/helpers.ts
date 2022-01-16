import { Position } from "../types";

export const shiftMoveToCurrentPosition = (
    position: Position,
    move: number[][]
  ): number[][] => {
    let moveCopy = move.map((arr) => arr.slice());
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
        moveCopy.forEach((array) => {
          array.shift();
          array.push(0);
        });
        column++;
      }
    } else if (column > 0) {
      while (column > 0) {
        moveCopy.forEach((array) => {
          array.unshift(0);
          array.pop();
        });
        column--;
      }
    }
  
    return moveCopy;
  };