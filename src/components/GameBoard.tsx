import { useState, useEffect, useReducer } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, Position, MoveCard } from "../types/index";
import { shiftMoveToCurrentPosition, randomGenerator, resetHighlightedCells, highlightValidMoves, getCell } from "../utils/helpers";

import { INITIAL_BOARD, MOVES } from "../constants/index";
import MoveCardElement from "./MoveCardElement";

const flexContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
  width: "85%",
  margin: "0 auto",
};

interface InitGameState {
  blueMoveCards: MoveCard[];
  currentPlayer: "red" | "blue";
  gameBoard: Cell[][];
  isGameOver: boolean;
  rotatingCard: MoveCard;
  redMoveCards: MoveCard[];
  selectedMoveCard: MoveCard | undefined;
  selectedCell: Position | undefined;
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "START_GAME": {
      let newState = { ...state };
      let moves = randomGenerator(MOVES);

      newState.selectedCell = undefined;
      newState.redMoveCards = moves.slice(0, 2);
      newState.blueMoveCards = moves.slice(2, 4);
      newState.rotatingCard = moves[4];
      newState.gameBoard = INITIAL_BOARD;
      newState.isGameOver = false;
      newState.selectedMoveCard = newState.redMoveCards[0];
      return newState;
    }

    case "SELECT": {
      let newState = { ...state };
      let { payload } = action;
      let { gameBoard, selectedMoveCard, selectedCell } = newState;
      let targetCell = getCell(gameBoard, payload);

      // Empyt Cell
      if (targetCell.piece === 0) {
        resetHighlightedCells(gameBoard);
        newState.selectedCell = undefined
        return newState;
      
        // Not Empty Cell
      } else if (targetCell.piece) {
        resetHighlightedCells(gameBoard);

        // Invalid move
        if(selectedCell && !targetCell.isValid) {
          newState.selectedCell = undefined
          return newState
        }


        let highlightedBoard = highlightValidMoves(
          gameBoard,
          selectedMoveCard,
          targetCell,
          payload
        );
        newState.selectedCell = payload;
      }
      return newState;
    }

    case "SELECT_MOVE_CARD": {
      let newState = { ...state };
      let { payload } = action;
      let { selectedCell, gameBoard } = newState;
      newState.selectedMoveCard = payload;

      if (selectedCell) {
        let currentlySelectedCell = getCell(gameBoard, selectedCell);
        resetHighlightedCells(gameBoard);
        newState.gameBoard = highlightValidMoves(
          gameBoard,
          payload,
          currentlySelectedCell,
          selectedCell
        );
      }
      return newState;
    }

    default: {
      return state;
    }
  }
};




function GameBoard() {
  const [selectedCell, setSelectedCell] = useState<Position | undefined>(
    undefined
  );
  const initialGameState: InitGameState = {
    blueMoveCards: [MOVES[3], MOVES[4]],
    currentPlayer: "red",
    gameBoard: INITIAL_BOARD,
    isGameOver: false,
    rotatingCard: MOVES[0],
    redMoveCards: [MOVES[1], MOVES[2]],
    selectedCell: undefined,
    selectedMoveCard: undefined,
  };

  const [gameState, dispatch] = useReducer(reducer, initialGameState);
  const [selectedMoveCard, setSelectedMoveCard] = useState<MoveCard>(MOVES[0]);

  // const swapMoveCard = (move: MoveCard, side: "red" | "blue"): void => {
  //   if (side === "blue") {
  //     let temp = rotatingCard;

  //     let newBlueCards: MoveCard[] = blueMoveCards.map((item) => {
  //       if (item.name === move.name) {
  //         item = temp;
  //       }
  //       return item;
  //     });

  //     setRotatingCard(move);
  //     // newBlueCards.push(temp)
  //     setBlueMoveCards(newBlueCards);
  //   } else {
  //     let temp = rotatingCard;
  //     let newMoveCards: MoveCard[] = redMoveCards.map((item) => {
  //       if (item.name === move.name) {
  //         item = temp;
  //       }
  //       return item;
  //     });

  //     setRotatingCard(move);
  //     // newMoveCards.push(temp)
  //     setRedMoveCards(newMoveCards);
  //   }
  // };

  const renderCells = (state: Cell[][]) => {
    return state.map((item, y) => {
      return (
        <>
          {item.map((i, x) => {
            let isCellSelected;
            if (gameState.selectedCell === undefined) {
              isCellSelected = false;
            } else {
              isCellSelected =
                gameState.selectedCell.x === x &&
                gameState.selectedCell.y === y;
            }

            return (
              <GameCell
                isSelected={isCellSelected}
                key={`${x}-${y}`}
                position={{ x, y }}
                piece={i}
                handleClick={(pos) =>
                  dispatch({ type: "SELECT", payload: pos })
                }
              />
            );
          })}
        </>
      );
    });
  };


  useEffect(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  useEffect(() => {
    if (selectedCell) {
    }
  }, [selectedMoveCard]);

  return (
    <div>
      <div
        style={{
          margin: "0 auto",
          maxWidth: "200px",
          color: "blue",
        }}
      >
        {gameState.redMoveCards.map((card: MoveCard, idx: number) => {
          return (
            <div key={idx}>
              <MoveCardElement isActive={false} move={card} />
            </div>
          );
        })}
      </div>
      <div style={flexContainerStyle}>
        <div className="grid_item">{gameState.rotatingCard?.name}</div>
        <div className="grid">{renderCells(gameState.gameBoard)}</div>
      </div>

      <div
        style={{
          margin: "0 auto",
          maxWidth: "200px",
          color: "red",
        }}
      >
        {gameState.redMoveCards.map((card: MoveCard, idx: number) => {
          let isActive = gameState.selectedMoveCard
            ? gameState.selectedMoveCard.name
            : "";
          return (
            <div
              onClick={() =>
                dispatch({ type: "SELECT_MOVE_CARD", payload: card })
              }
            >
              <MoveCardElement
                key={idx}
                move={card}
                isActive={isActive === card.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameBoard;
