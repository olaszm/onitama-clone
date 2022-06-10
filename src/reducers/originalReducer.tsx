import { MOVES } from "../constants";
import { InitGameState, initialGameState, MoveCard } from "../types";
import { Cell } from "../classes/CellClass";
import {
	flipMoveCard,
	getCell,
	highlightValidMoves,
	randomGenerator,
	resetHighlightedCells,
	swapCurrentPlayer,
	swapMoveCard,
	swapPieces,
	takePiece,
} from "../utils";

import { cloneDeep } from "lodash";

export const reducer = (state: any, action: any) => {
	switch (action.type) {
		case "START_GAME": {
			let newState: InitGameState = cloneDeep(state);

			console.log(newState);
			if (newState.gameInstance) {
				const gameInstance = newState.gameInstance;
				gameInstance.startGame();
				return newState;
			}

			return state;
		}
		case "SELECT": {
			let newState: InitGameState = cloneDeep(state);
			if (!newState.gameInstance) return newState;

			let gameInstance = newState.gameInstance;
			if (gameInstance.isGameOver) return newState;

			let userSelectedPosition = action.payload;
			let piece = gameInstance.getCellByPosition(
				userSelectedPosition.x,
				userSelectedPosition.y
			);
			// console.log(action.payload, piece);

			gameInstance.selectPiece({ position: userSelectedPosition });
			return newState;
			// if (newState.isGameOver) {
			//   return newState;
			// }
			// let { payload } = action;

			// let targetCell: Cell = getCell(newState.gameBoard, payload);
			// const isSamePieceAsCurrentPlayer =
			//   targetCell.piece && newState.currentPlayer === targetCell.piece.side;
			// const isValidMove = !targetCell.piece && targetCell.isValid;
			// const isEnemyShrine =
			//   targetCell.isShrine &&
			//   targetCell.isShrine.side !== newState.currentPlayer;
			// const isEnemyKing =
			//   targetCell.isValid &&
			//   targetCell.piece &&
			//   targetCell.piece.type === "king";
			// const isValidAndIsEnemyPiece =
			//   targetCell.isValid &&
			//   targetCell.piece &&
			//   newState.currentPlayer !== targetCell.piece.side;

			// // Nothing is selected
			// if (!newState.selectedCell) {
			//   // If nothing is selected and clicked on an empty cell
			//   if (!targetCell.piece) {
			//     return newState;
			//     // If nothing is selected and clicked on a same color as current player
			//   } else if (targetCell.piece.side === newState.currentPlayer) {
			//     newState.selectedCell = payload;

			//     newState.gameBoard = highlightValidMoves(
			//       newState.gameBoard,
			//       newState.selectedMoveCard,
			//       payload,
			//       newState.currentPlayer
			//     );

			//     return newState;
			//   }
			// } else {
			//   //  Valid move to empty cell
			//   if (isValidMove) {
			//     newState = swapMoveCard(newState);

			//     if (payload && newState.selectedCell) {
			//       swapPieces(newState.gameBoard, newState.selectedCell, payload);
			//     }

			//     newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
			//     newState.gameBoard = resetHighlightedCells(newState.gameBoard);

			//     newState.selectedCell = undefined;
			//     newState.selectedMoveCard = undefined;

			//     if (isEnemyShrine) {
			//       newState.isGameOver = true;
			//       newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
			//     }
			//     return {
			//       ...newState,
			//       gameBoard: newState.gameBoard,
			//       selectedCell: newState.selectedCell,
			//       currentPlayer: newState.currentPlayer,
			//     };
			//   }

			//   if (isSamePieceAsCurrentPlayer) {
			//     newState.selectedCell = payload;
			//     newState.gameBoard = highlightValidMoves(
			//       newState.gameBoard,
			//       newState.selectedMoveCard,
			//       payload,
			//       newState.currentPlayer
			//     );
			//     return newState;
			//   }

			//   if (isValidAndIsEnemyPiece) {
			//     newState = swapMoveCard(newState);
			//     if (payload && newState.selectedCell) {
			//       takePiece(newState.gameBoard, newState.selectedCell, payload);
			//     }
			//     newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
			//     newState.gameBoard = resetHighlightedCells(newState.gameBoard);
			//     newState.selectedCell = undefined;

			//     if (isEnemyKing || isEnemyShrine) {
			//       newState.isGameOver = true;
			//       newState.currentPlayer = swapCurrentPlayer(newState.currentPlayer);
			//     }

			//     return newState;
			//   }

			//   //  Invalid move
			//   if (!targetCell.isValid) {
			//     return newState;
			//   }
			// }
		}

		case "SELECT_MOVE_CARD": {
			// throw new Error('Not implemented')
			let newState: InitGameState = cloneDeep(state);
			let { payload } = action;

			if (newState.gameInstance) {
				newState.gameInstance.setSelectedMove(payload);
			}
			// selectedMoveCard = payload;

			// TODO: highlight valid cells
			// if (selectedCell) {
			// 	gameBoard = highlightValidMoves(
			// 		gameBoard,
			// 		payload,
			// 		selectedCell,
			// 		currentPlayer
			// 	);
			// }

			return newState;
		}

		case 'SWAP_MOVE_CARDS': {
			let newState: InitGameState = cloneDeep(state)
			if(newState.gameInstance) {
				newState.gameInstance.swapRotatingCards()
			}

			return newState
		}
		case "RESET_GAME": {
			let newState = cloneDeep(state);
			// PASS THESE AS PAYLOAD FOR NOW
			// EVENTUALLY CALL THE RESET FN ON BOARD CLASS TO HANDLE THESE
			if (newState.gameInstance) {
				newState.gameInstance = newState.gameInstance.resetGame();
			}
			return newState;
		}

		case "SET_GAME_INSTANCE": {
			console.log(action.payload);
			return { ...state, gameInstance: action.payload };
		}

		default: {
			return state;
		}
	}
};
