import { MOVES } from "../constants";
import { Cell, InitGameState, initialGameState } from "../types";
import {
  getCell,
  highlightValidMoves,
  randomGenerator,
  resetHighlightedCells,
  swapCurrentPlayer,
  swapMoveCard,
  swapPieces,
  takePiece,
} from "../utils/helpers";

import { cloneDeep } from "lodash";

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "START_GAME": {
      let newState = cloneDeep(state);
      let moves = randomGenerator(MOVES);
      newState.redMoveCards = [moves[0], moves[1]];
      newState.blueMoveCards = [moves[2], moves[3]];
      newState.rotatingCard = moves[4];
      newState.selectedMoveCard = undefined;
      return newState;
    }

    case "SELECT": {
      let newState: InitGameState = cloneDeep(state);

      if (newState.isGameOver) {
        return newState;
      }
      let { payload } = action;

      let targetCell: Cell = getCell(newState.gameBoard, payload);
      const isSamePieceAsCurrentPlayer =
        targetCell.piece && newState.currentPlayer === targetCell.piece.side;
      const isValidMove = !targetCell.piece && targetCell.isValid;
      const isEnemyShrine =
        targetCell.isShrine &&
        targetCell.isShrine.side !== newState.currentPlayer;
      const isEnemyKing =
        targetCell.isValid &&
        targetCell.piece &&
        targetCell.piece.type === "king";
      const isValidAndIsEnemyPiece =
        targetCell.isValid &&
        targetCell.piece &&
        newState.currentPlayer !== targetCell.piece.side;

      // Nothing is selected
      if (!newState.selectedCell) {
        // If nothing is selected and clicked on an empty cell
        if (!targetCell.piece) {
          return newState;
          // If nothing is selected and clicked on a same color as current player
        } else if (targetCell.piece.side === newState.currentPlayer) {
          newState.selectedCell = payload;
          newState.selectedMoveCard =
            newState.currentPlayer === "red"
              ? newState.redMoveCards[0]
              : newState.blueMoveCards[0];

          newState.gameBoard = highlightValidMoves(
            newState.gameBoard,
            newState.selectedMoveCard,
            targetCell,
            payload
          );
          
          return newState;
        }
      } else {
        //  Valid move to empty cell
        if (isValidMove) {
          newState = swapMoveCard(newState);

          if (payload && newState.selectedCell) {
            swapPieces(newState.gameBoard, newState.selectedCell, payload);
          }

          newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
          newState.gameBoard = resetHighlightedCells(newState.gameBoard);

          newState.selectedCell = undefined;
          newState.selectedMoveCard = undefined;

          if (isEnemyShrine) {
            newState.isGameOver = true;
            newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
          }
          return {
            ...newState,
            gameBoard: newState.gameBoard,
            selectedCell: newState.selectedCell,
            currentPlayer: newState.currentPlayer,
          };
        }

        if (isSamePieceAsCurrentPlayer) {
          newState.selectedCell = payload;
          newState.gameBoard = highlightValidMoves(
            newState.gameBoard,
            newState.selectedMoveCard,
            targetCell,
            payload
          );
          return newState;
        }

        if (isValidAndIsEnemyPiece) {
          newState = swapMoveCard(newState);
          if (payload && newState.selectedCell) {
            takePiece(newState.gameBoard, newState.selectedCell, payload);
          }
          newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
          newState.gameBoard = resetHighlightedCells(newState.gameBoard);
          newState.selectedCell = undefined;

          if (isEnemyKing || isEnemyShrine) {
            newState.isGameOver = true;
            newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
          }

          return newState;
        }

        //  Invalid move
        if (!targetCell.isValid) {
          return newState;
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
      newState.redMoveCards = [moves[0], moves[1]];
      newState.blueMoveCards = [moves[2], moves[3]];
      newState.rotatingCard = moves[4];
      newState.selectedMoveCard = undefined;
      newState.gameBoard = resetHighlightedCells(newState.gameBoard);
      return newState;
    }
    default: {
      return state;
    }
  }
};
