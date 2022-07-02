import { Position, TMoveCard } from "../types";
import { cloneDeep, shuffle } from "lodash";
import { Board } from "../classes/BoardClass";
import MoveCardC from "../classes/MoveCardClass";


export const createMovesFromData = (moves: TMoveCard[]): MoveCardC[] => {
	return moves.map(el => {
		return new MoveCardC(el.name, el.moves)
	})
}

export const shiftMoveToCurrentPosition = (
	position: Position,
	move: number[][]
): number[][] => {
	let moveCopy = cloneDeep(move); //move.map((arr) => arr.slice());
	let column = position.y - 2;
	let row = position.x - 2;

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

export const flip2DArrayHorizontally = (list: number[][]) => {
	const listCopy = cloneDeep(list);

	let temp;
	for (let row = 0; row < Math.round(listCopy.length / 2); row++) {
		temp = listCopy[listCopy.length - row - 1];
		listCopy[listCopy.length - row - 1] = listCopy[row];
		listCopy[row] = temp;
	}

	return listCopy;
};

export const flip2DArrayVertically = (list: number[][]) => {
	const listCopy = cloneDeep(list);

	let temp;
	for (let row = 0; row < listCopy.length; row++) {
		for (let col = 0; col < listCopy[0].length / 2; col++) {
			temp = listCopy[row][listCopy[0].length - col - 1];
			listCopy[row][listCopy[0].length - col - 1] = listCopy[row][col];
			listCopy[row][col] = temp;
		}
	}

	return listCopy;
};

export const flipMoveCard = (card: TMoveCard) => {
	card.moves = flip2DArrayHorizontally(flip2DArrayVertically(card.moves));
	return card;
};

export const randomGenerator = (array: Array<any>) => {
	array = cloneDeep(array);
	return shuffle(array);
};

export const heuristicEval = (state: Board, maximizingPlayer: boolean) => {
	const { isGameOver, currentPlayer } = state;
	const maxiPlayer = maximizingPlayer ? 'blue' : 'red'

	let value = 0 

	if (isGameOver && maximizingPlayer && currentPlayer === 'blue' ) {
		value += 1200;
	} else if (isGameOver && !maximizingPlayer && currentPlayer === 'red' ) {
		value -= 1000;
	}
	
	const allPiecePositions = state.getPiecePositions()

	allPiecePositions.forEach(pos => {
		const cell = state.getCellByPosition(pos.x, pos.y);
		if(cell && cell.piece) {
			if(maxiPlayer === cell.piece.side) {
				value += 15
			} else {
				value -= 10
			}
		} 
	})

	return value
};

export const alphabeta = (
	gameState: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizingPlayer: boolean,
): [any, number] => {
	let board = gameState;

	if (depth === 0 || board.isGameOver) {
		let evaluatedScore = heuristicEval(gameState, maximizingPlayer);
		return [undefined, evaluatedScore];
	}


	if (maximizingPlayer) {
		let bestEval = -Infinity;
		// For each piece, we need to get all possible positions
		// and move to mositions, copyboard and pass it to alphabeta

		let allPiecePositions = board.getAllPiecePositionBySide('blue')

		let bestMove: any = [];

		for (let i = 0; i < allPiecePositions.length; i++) {
			const currentPosition = allPiecePositions[i];
			// Get valid moves for each movecard and current position
			for (let j = 0; j < board.bluePlayerMoveCards.length; j++) {
				const moveCard = board.bluePlayerMoveCards[j];
				
				// Get valid moves for current cell + move card
				const validTargetPositions = board.getValidMoves(
					moveCard,
					currentPosition,
					"blue"
				);

				
				for (let k = 0; k < validTargetPositions.length; k++) {
					const targetPosition = validTargetPositions[k];

					const boardCopy = cloneDeep(board)
					boardCopy.move(currentPosition, targetPosition, moveCard)

					let [, currentEval] = alphabeta(
						boardCopy,
						depth - 1,
						alpha,
						beta,
						false,
					);

					if (currentEval > bestEval) {
						bestEval = currentEval;
						bestMove = [currentPosition, moveCard, targetPosition];
					}

					if (bestEval >= beta) break;
					alpha = Math.max(alpha, bestEval);
				}
			}
		}
		return [bestMove, bestEval];
	} else {
		let minEval = Infinity;
		let bestMove: any = [];

		let allPiecePositions = board.getAllPiecePositionBySide("red");

		for (let i = 0; i < allPiecePositions.length; i++) {
			const currentPosition = allPiecePositions[i];
			for (let j = 0; j < board.redPlayerMoveCards.length; j++) {
				const moveCard = board.redPlayerMoveCards[j];

				const validTargetPositions = board.getValidMoves(
					moveCard,
					currentPosition,
					"red"
				);


				for (let k = 0; k < validTargetPositions.length; k++) {
					const targetPosition = validTargetPositions[k];

					const boardCopy = cloneDeep(board)
					boardCopy.move(currentPosition, targetPosition, moveCard)


					let [, currentEval] = alphabeta(
						boardCopy,
						depth - 1,
						alpha,
						beta,
						true,
					);
					if (currentEval < minEval) {
						minEval = currentEval;
						bestMove = [currentPosition, moveCard, targetPosition];
					}
					if (minEval <= alpha) break;
					beta = Math.min(beta, minEval);
				}
			}
		}

		return [bestMove, minEval];
	}
};