import { Board } from '../classes/BoardClass'
import { cloneDeep } from "lodash";

export const reducer = (state: any, action: any) => {
	switch (action.type) {
		case "START_GAME": {
			if(!state) return state

			let board: Board = cloneDeep(state);
			if (board) {
				board.startGame();
				return board;
			}

			return state;
		}
		case "SELECT": {
			let board: Board = cloneDeep(state);
			if (!board) return board;

			let gameInstance = board;
			if (gameInstance.isGameOver) return board;

			let userSelectedPosition = action.payload;
			gameInstance.selectCell({ position: userSelectedPosition });
			return board;
		}

		case "SELECT_MOVE_CARD": {
			let board: Board = cloneDeep(state);
			let { payload } = action;

			if (board) {
				board.setSelectedMove(payload);
			}
		
			return board;
		}

		case 'SWAP_MOVE_CARDS': {
			let board: Board = cloneDeep(state)
			if(board) {
				board.swapRotatingCards()
			}

			return board
		}
		case "RESET_GAME": {
			let board = cloneDeep(state);
			// PASS THESE AS PAYLOAD FOR NOW
			// EVENTUALLY CALL THE RESET FN ON BOARD CLASS TO HANDLE THESE
			if (board) {
				return board.resetGame();
			}
			return board;
		}

		case "SET_GAME_INSTANCE": {
			return action.payload 
		}

		default: {
			return state;
		}
	}
};
