import { useState, useEffect, useReducer } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, Position, MoveCard, Piece } from "../types/index";
import {
  shiftMoveToCurrentPosition,
  randomGenerator,
  resetHighlightedCells,
  highlightValidMoves,
  getCell,
} from "../utils/helpers";

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
      newState.redMoveCards = newState.redMoveCards = [MOVES[0], MOVES[0]];
      newState.blueMoveCards = [MOVES[0], MOVES[0]];
      newState.rotatingCard = moves[4];
      newState.gameBoard = INITIAL_BOARD;
      newState.isGameOver = false;
      newState.selectedMoveCard = MOVES[0];
      return newState;
    }

    case "SELECT": {
      let newState = { ...state };
      let { payload } = action;

      let targetCell: Cell = getCell(newState.gameBoard, payload);

      // Nothing is selected
      if (!newState.selectedCell) {
        // If nothing is selected and clicked on an empty cell
        if (!targetCell.piece) {
          console.log("No selection + empyt cell");
          return newState;
          // If nothing is selected and clicked on a correct color piece
        } else if (targetCell.piece.side === newState.currentPlayer) {
          highlightValidMoves(
            newState.gameBoard,
            newState.selectedMoveCard,
            targetCell,
            payload
          );
          newState.selectedCell = payload;
          return newState;
        }
        // Already selected
      } else {
        //  Invalid move
        if (!targetCell.isValid) {
          console.log("Invalid move");
          return newState;
          //  Valid move to empty cell
        } else if (!targetCell.piece && targetCell.isValid) {
          let tempPiece: Piece =
          newState.gameBoard[newState.selectedCell.y][
            newState.selectedCell.x
          ].piece;
          
          console.log(targetCell)
          if(targetCell.isShrine) {
            console.log('Shrine capture')
            newState.isGameOver = true
            resetHighlightedCells(newState.gameBoard);
            return newState
          }

          newState.gameBoard[newState.selectedCell.y][newState.selectedCell.x].piece =
            targetCell.piece;
          newState.gameBoard[payload.y][payload.x].piece = tempPiece;

          state.selectedCell = undefined;
          state.currentPlayer =
            newState.currentPlayer === "red" ? "blue" : "red";
          resetHighlightedCells(newState.gameBoard);
          return newState;
        } else {
          // Capture King
          if(targetCell.piece && targetCell.piece.type === 'king'){
            newState.isGameOver = true
            console.log('Game Over, King Captured')
          }

          // Capture
          let temp: Cell =
            newState.gameBoard[newState.selectedCell.y][
              newState.selectedCell.x
            ];
            targetCell.piece = 0
          newState.gameBoard[newState.selectedCell.y][newState.selectedCell.x] =
            targetCell;
          newState.gameBoard[payload.y][payload.x] = temp;
          state.selectedCell = undefined;
          state.currentPlayer =
            newState.currentPlayer === "red" ? "blue" : "red";
          resetHighlightedCells(newState.gameBoard);

          return newState;
        }
      }

      console.log("else");
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
            let { selectedCell } = gameState;

            return (
              <GameCell
                isSelected={
                  !selectedCell
                    ? false
                    : selectedCell.x === x && selectedCell.y === y
                    ? true
                    : false
                }
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

  return (
    <div>
      <div
        style={{
          margin: "0 auto",
          maxWidth: "200px",
          color: "blue",
        }}
      >
        {gameState.blueMoveCards.map((card: MoveCard, idx: number) => {
          return (
            <div
              key={idx}
              onClick={() => {
                if (gameState.currentPlayer === "blue") {
                  dispatch({ type: "SELECT_MOVE_CARD", payload: card });
                }
              }}
            >
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
              onClick={() => {
                if (gameState.currentPlayer === "red") {
                  dispatch({ type: "SELECT_MOVE_CARD", payload: card });
                }
              }}
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
