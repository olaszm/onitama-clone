import { useState, useEffect } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, Position, MoveCard } from "../types/index";
import { shiftMoveToCurrentPosition, randomGenerator } from "../utils/helpers";

import { MOVES } from "../constants/index";

function GameBoard() {
  const [selectedCell, setSelectedCell] = useState<Position | undefined>(
    undefined
  );
  const [selectedMoveCard, setSelectedMoveCard] = useState<MoveCard>(MOVES[0]);
  const [redMoveCards, setRedMoveCards] = useState<MoveCard[]>([]);
  const [blueMoveCards, setBlueMoveCards] = useState<MoveCard[]>([]);
  const [rotatingCard, setRotatingCard] = useState<MoveCard>();

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

  
  const highlightValidCells = (position: Position, moveCard: MoveCard):void => {
    let newState: Cell[][] = [...state];
    let currentPiece = state[position.y][position.x];

    // Rotate moveCard to match sides
    if (
      currentPiece.piece &&
      currentPiece.piece.side === "blue" &&
      moveCard
    ) {
      moveCard.moves = moveCard.moves.map((y) => y.reverse()).reverse();
    }

    // Shift center value to match selected piece
    let shiftedValidCells = shiftMoveToCurrentPosition(
      position,
      moveCard?.moves || [[]]
    );

    // Highlight valid cells
    for (let x = 0; x < newState.length; x++) {
      for (let y = 0; y < newState[x].length; y++) {
        if (shiftedValidCells[x][y] === 1) {
          newState[x][y].isValid = true;
        }
      }
    }

    setState(newState);
  }

  const moveTo = (position: Position, moveCard: MoveCard): void => {
    if (selectedCell === undefined) {
      setSelectedCell(position);
      highlightValidCells(position, moveCard)
    } else {
      let newState: Cell[][] = [...state];
      let targetCell = newState[position.y][position.x];

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

  const resetValidMoveHighlight = () => {
    let newState: Cell[][] = [...state];

    for (let x = 0; x < newState.length; x++) {
      for (let y = 0; y < newState[x].length; y++) {
        newState[x][y].isValid = false;
      }
    }

    setState(newState);
  };

  useEffect(() => {
    const randomCards = randomGenerator(MOVES);

    setBlueMoveCards(randomCards.slice(2, 4));
    setRedMoveCards(randomCards.slice(0, 2));
    setRotatingCard(randomCards[4]);
  }, []);


  useEffect(() => {
    if(selectedCell) {
      resetValidMoveHighlight()
      highlightValidCells(selectedCell, selectedMoveCard)
    }
  }, [selectedMoveCard])

  return (
    <div>
      <div
        style={{
          color: "blue",
        }}
      >
        {blueMoveCards.map((card, idx) => {
          return <div key={idx}> {card.name} </div>;
        })}
      </div>
      <div className="grid">{renderCells(state)}</div>
      <div>{rotatingCard?.name}</div>

      <div
        style={{
          color: "red",
        }}
      >
        {redMoveCards.map((card, idx) => {
          return (
            <div onClick={() => setSelectedMoveCard(card)} key={idx}>
              {" "}
              {card.name}{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameBoard;
