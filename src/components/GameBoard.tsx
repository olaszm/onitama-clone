import { useState } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, Position, MoveCard } from "../types/index";
import { shiftMoveToCurrentPosition } from "../utils/helpers";


const BOAR = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 3, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

function GameBoard() {
  const [selectedCell, setSelectedCell] = useState<Position | undefined>(
    undefined
  );
  const [selectedMoveCard, setSelectedMoveCard] = useState<MoveCard>(BOAR)

  const [state, setState] = useState<Cell[][]>([
    [
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "blue",
        },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "blue",
        },
      },
      {
        isShrine: true,
        isValid: false,
        piece: { type: "king", side: "blue" },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "blue",
        },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "blue",
        },
      },
    ],
    [
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
    ],
    [
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
    ],
    [
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
      { isShrine: false, isValid: false, piece: 0 },
    ],
    [
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "red",
        },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "red",
        },
      },
      {
        isShrine: true,
        isValid: false,
        piece: { type: "king", side: "red" },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "red",
        },
      },
      {
        isShrine: false,
        isValid: false,
        piece: {
          type: "pawn",
          side: "red",
        },
      },
    ],
  ]);

  const resetValidMoveHighlight = () => {
    let newState: Cell[][] = [...state];

    for (let x = 0; x < newState.length; x++) {
      for (let y = 0; y < newState[x].length; y++) {
        newState[x][y].isValid = false;
      }
    }

    setState(newState);
  };

  const moveTo = (position: Position, moveCard: number[][]): void => {
    if (selectedCell === undefined) {
      setSelectedCell(position);

      // Highlight valid cells
      let newState: Cell[][] = [...state];

      let shiftedValidCells = shiftMoveToCurrentPosition(position, moveCard);

      for (let x = 0; x < newState.length; x++) {
        for (let y = 0; y < newState[x].length; y++) {
          if (shiftedValidCells[x][y] === 1) {
            newState[x][y].isValid = true;
          }
        }
      }

      setState(newState);
    } else {
      let newState: Cell[][] = [...state];
      let targetCell = newState[position.y][position.x];
      let currentCell = newState[selectedCell.x][selectedCell.y];

      if (targetCell.isValid) {
        let temp = newState[selectedCell.y][selectedCell.x];
        newState[selectedCell.y][selectedCell.x] = targetCell;
        newState[position.y][position.x] = temp;
        setState(newState);
        setSelectedCell(undefined);
        resetValidMoveHighlight();
      } else {
        setSelectedCell(undefined);
        resetValidMoveHighlight();
      }
    }
  };

  const renderCells = (state: Cell[][]) => {
    return state.map((item, y) => {
      return (
        <>
          {item.map((i, x) => {
            let isCellSelected;
            if (selectedCell === undefined) {
              isCellSelected = false;
            } else {
              isCellSelected = selectedCell.x === x && selectedCell.y === y;
            }

            return (
              <GameCell
                isSelected={isCellSelected}
                key={`${x}-${y}`}
                position={{ x, y }}
                piece={i}
                handleClick={(pos) => moveTo(pos, selectedMoveCard)}
              />
            );
          })}
        </>
      );
    });
  };

  return <div className="grid">{renderCells(state)}</div>;
}

export default GameBoard;
