import { INITIAL_BOARD, MOVES } from "../constants";
import { Cell, initialGameState, Piece } from "../types";
import {
  getCell,
  getPiece,
  highlightValidMoves,
  randomGenerator,
  resetHighlightedCells,
} from "../utils/helpers";

import { cloneDeep } from "lodash";

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "START_GAME": {
      let newState = cloneDeep(state);
      let moves = randomGenerator(MOVES);
      newState.redMoveCards = [MOVES[0], MOVES[0]];
      newState.blueMoveCards = [MOVES[0], MOVES[0]];
      newState.rotatingCard = moves[4];
      newState.selectedMoveCard = MOVES[0];
      return newState;
    }

    case "SELECT": {
      let newState = cloneDeep(state);
      let { payload } = action;

      let targetCell: Cell = getCell(newState.gameBoard, payload);

      // Nothing is selected
      if (!newState.selectedCell) {
        // If nothing is selected and clicked on an empty cell
        if (!targetCell.piece) {
          return newState;
          // If nothing is selected and clicked on a same color as current player
        } else if (targetCell.piece.side === newState.currentPlayer) {
          newState.gameBoard = highlightValidMoves(
            newState.gameBoard,
            newState.selectedMoveCard,
            targetCell,
            payload
          );
          newState.selectedCell = payload;
          return newState;
        }
      } else {
        //  Invalid move
        if (!targetCell.isValid) {
          return newState;
        }

        //  Valid move to empty cell
        if (!targetCell.piece && targetCell.isValid) {
          let { gameBoard, selectedCell, currentPlayer } = cloneDeep(state);
          let tempPiece: Piece | undefined = getPiece(gameBoard, {
            y: selectedCell.y,
            x: selectedCell.x,
          });

          // if (targetCell.isShrine) {
          //   console.log("Shrine capture");
          //   newState.isGameOver = true;
          //   newState.gameBoard = resetHighlightedCells(state.gameBoard);
          //   return newState;
          // }

          gameBoard[selectedCell.y][selectedCell.x].piece = targetCell.piece;
          gameBoard[payload.y][payload.x].piece = tempPiece;

          selectedCell = undefined;
          currentPlayer = currentPlayer === "red" ? "blue" : "red";
          // gameBoard = resetHighlightedCells(gameBoard);
          return { ...newState, gameBoard };
        }
      }

      return state;
    }

    case "SELECT_MOVE_CARD": {
      let { selectedCell, gameBoard, selectedMoveCard } = cloneDeep(state);
      let { payload } = action;
      selectedMoveCard = payload;

      if (selectedCell) {
        let currentlySelectedCell = getCell(gameBoard, selectedCell);
        gameBoard = resetHighlightedCells(gameBoard);
        gameBoard = highlightValidMoves(
          gameBoard,
          payload,
          currentlySelectedCell,
          selectedCell
        );
      }

      return { ...state, gameBoard, selectedMoveCard };
    }
    case "RESET_GAME": {
      let newState = cloneDeep(initialGameState);
      let moves = randomGenerator(MOVES);
      newState.redMoveCards = [MOVES[0], MOVES[0]];
      newState.blueMoveCards = [MOVES[0], MOVES[0]];
      newState.rotatingCard = moves[4];
      newState.selectedMoveCard = MOVES[0];
      newState.gameBoard = resetHighlightedCells(newState.gameBoard)
      return newState;
    }
    default: {
      return state;
    }
  }
};
