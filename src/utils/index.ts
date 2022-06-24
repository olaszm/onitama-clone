import { Position, MoveCard } from "../types";
import { cloneDeep, shuffle } from "lodash";

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

export const flipMoveCard = (card: MoveCard) => {
	card.moves = flip2DArrayHorizontally(flip2DArrayVertically(card.moves));
	return card;
};

export const randomGenerator = (array: Array<any>) => {
	array = cloneDeep(array);
	return shuffle(array);
};


export const alphabeta = (
	gameState: any,
	depth: number,
	alpha: number,
	beta: number,
	maximizingPlayer: boolean,
	moveFn: (currentState: any, params: {}) => {}
): [any, number] => {
	throw new Error('Not implemented')

	// if (depth === 0 || gameState.isGameOver) {
	// 	let evaluatedScore = heuristicEval(gameState, maximizingPlayer)
	// 	return [undefined, evaluatedScore];
	// }

	// if (maximizingPlayer) {
	// 	let bestEval = -Infinity;
	// 	// For each piece, we need to get all possible positions
	// 	// and move to mositions, copyboard and pass it to alphabeta
	// 	let allPiecePositions = getAllPiecePositionsForASide(
	// 		gameState.gameBoard,
	// 		"blue"
	// 	);
	// 	let bestMove: any = [];

	// 	for (let i = 0; i < allPiecePositions.length; i++) {
	// 		const currentPosition = allPiecePositions[i];
	// 		for (let j = 0; j < gameState.blueMoveCards.length; j++) {
	// 			const moveCard = gameState.blueMoveCards[j];
	// 			const validTargetPositions = getValidMoves(
	// 				gameState.gameBoard,
	// 				moveCard,
	// 				currentPosition,
	// 				"blue"
	// 			);

	// 			let currentState = moveFn(gameState, {
	// 				type: "SELECT",
	// 				payload: currentPosition,
	// 			});
	// 			currentState = moveFn(currentState, {
	// 				type: "SELECT_MOVE_CARD",
	// 				payload: moveCard,
	// 			});

	// 			for (let k = 0; k < validTargetPositions.length; k++) {
	// 				const pos = validTargetPositions[k];
	// 				const newState: any = moveFn(currentState, {
	// 					type: "SELECT",
	// 					payload: pos,
	// 				});
	// 				let currentEval = alphabeta(
	// 					newState,
	// 					depth - 1,
	// 					alpha,
	// 					beta,
	// 					false,
	// 					moveFn
	// 				)[1];
	// 				if (currentEval > bestEval) {
	// 					bestEval = currentEval;
	// 					bestMove = [currentPosition, moveCard, pos];
	// 				}

	// 				if (bestEval >= beta) break;
	// 				alpha = Math.max(alpha, bestEval);
	// 			}
	// 		}
	// 	}
	// 	return [bestMove, bestEval];
	// } else {
	// 	let minEval = Infinity;
	// 	let bestMove: any = [];
	// 	let allPiecePositions = getAllPiecePositionsForASide(
	// 		gameState.gameBoard,
	// 		"red"
	// 	);

	// 	for (let i = 0; i < allPiecePositions.length; i++) {
	// 		const currentPosition = allPiecePositions[i];
	// 		for (let j = 0; j < gameState.redMoveCards.length; j++) {
	// 			const moveCard = gameState.redMoveCards[j];
	// 			const validTargetPositions = getValidMoves(
	// 				gameState.gameBoard,
	// 				moveCard,
	// 				currentPosition,
	// 				"blue"
	// 			);

	// 			let currentState = moveFn(gameState, {
	// 				type: "SELECT",
	// 				payload: currentPosition,
	// 			});
	// 			currentState = moveFn(currentState, {
	// 				type: "SELECT_MOVE_CARD",
	// 				payload: moveCard,
	// 			});

	// 			for (let k = 0; k < validTargetPositions.length; k++) {
	// 				const position = validTargetPositions[k];
	// 				const newState: any = moveFn(gameState, {
	// 					type: "SELECT",
	// 					payload: position,
	// 				});
	// 				let currentEval = alphabeta(
	// 					newState,
	// 					depth - 1,
	// 					alpha,
	// 					beta,
	// 					true,
	// 					moveFn
	// 				)[1];
	// 				if (currentEval < minEval) {
	// 					minEval = currentEval;
	// 					bestMove = [currentPosition, moveCard, position];
	// 				}
	// 				if (minEval <= alpha) break;
	// 				beta = Math.min(beta, minEval);
	// 			}
	// 		}
	// 	}

	// 	return [bestMove, minEval];
	// }
};



export const heuristicEval = (state: any, maximizingPlayer: boolean) => {
	const { isGameOver, currentPlayer } = state  
	let blueScore = 0
	let redScore = 0
	
	if(isGameOver && maximizingPlayer) {
		redScore += 1000
		console.log('Game over', maximizingPlayer, currentPlayer)
	} else if(isGameOver && !maximizingPlayer){
		blueScore += 1000
		console.log('Game over', maximizingPlayer, currentPlayer)
	}

	throw new Error('Not implemented')


	// for (let x = 0; x < gameBoard.length; x++) {
	// 	for (let y = 0; y < gameBoard.length; y++) {
	// 		const cell:Cell = gameBoard[x][y];
	// 		const isBluePawn = cell.piece && cell.piece.side === 'blue' && cell.piece.type === 'pawn' 
	// 		const isBlueKing = cell.piece && cell.piece.side === 'blue' && cell.piece.type === 'king' 
	// 		const isRedPawn = cell.piece && cell.piece.side === 'red' && cell.piece.type === 'pawn' 
	// 		const isRedKing = cell.piece && cell.piece.side === 'red' && cell.piece.type === 'king' 
	// 		if((y > 1 || y < 3) && x > 2) {
	// 			blueScore += 3
	// 		}

	// 		if (isBluePawn) {
	// 			blueScore += 5
	// 		} else if(isBlueKing) {
	// 			blueScore += 10
	// 		} else if(isRedPawn) {
	// 			redScore += 5
	// 		} else if(isRedKing){
	// 			redScore += 10
	// 		}
	// 	}
	// }

	return maximizingPlayer ? redScore - blueScore : blueScore - redScore
}