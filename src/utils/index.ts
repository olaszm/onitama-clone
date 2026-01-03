import { Position, TMoveCard } from "../types";
import { cloneDeep, shuffle } from "lodash";
import { Board } from "../classes/BoardClass";
import MoveCardC from "../classes/MoveCardClass";

export const createMovesFromData = (moves: TMoveCard[]): MoveCardC[] => {
    return moves.map((el) => {
        return new MoveCardC(el.name, el.moves);
    });
};

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
    const maxiPlayer = maximizingPlayer ? "blue" : "red";

    let value = 0;

    if (isGameOver && maximizingPlayer && currentPlayer === "blue") {
        value += 900;
    } else if (isGameOver && !maximizingPlayer && currentPlayer === "red") {
        value -= 1100;
    }

    const allPiecePositions = state.getPiecePositions()

    allPiecePositions.forEach(pos => {
        const cell = state.getCellByPosition(pos.x, pos.y);
        if (cell && cell.piece) {
            if (maxiPlayer === cell.piece.side) {
                value += 5
            } else {
                value -= 30
            }
        }
    })

    return value;
};

type Move = [Position, any, Position];
type AlphaBetaResult = [Move | undefined, number];

// Helper to generate all valid moves for a side
const getAllValidMoves = (
    board: Board,
    side: "blue" | "red"
): Move[] => {
    const moveCards = side === "blue"
        ? board.bluePlayerMoveCards
        : board.redPlayerMoveCards;

    return board.board.flatMap((row, x) =>
        row.flatMap((cell, y) => {
            if (!cell.piece || cell.piece.side !== side) return [];

            const currentPosition = { x, y };
            return moveCards.flatMap(moveCard =>
                board
                    .getValidMoves(moveCard, currentPosition, side)
                    .map(targetPosition => [
                        currentPosition,
                        moveCard,
                        targetPosition
                    ] as Move)
            );
        })
    );
};

// Evaluate a single move and return the score
const evaluateMove = (
    board: Board,
    move: Move,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
): number => {
    const [currentPosition, moveCard, targetPosition] = move;
    const boardCopy = cloneDeep(board);
    boardCopy.move(currentPosition, targetPosition, moveCard);

    const [, score] = alphabeta(
        boardCopy,
        depth - 1,
        alpha,
        beta,
        !maximizingPlayer
    );

    return score;
};

export const alphabeta = (
    gameState: Board,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
): [any, number] => {
    if (depth === 0 || gameState.isGameOver) {
        return [undefined, heuristicEval(gameState, maximizingPlayer)];
    }

    const side = maximizingPlayer ? 'blue' : 'red'
    const validMoves = getAllValidMoves(gameState, side)

    if (validMoves.length === 0) {
        return [undefined, heuristicEval(gameState, maximizingPlayer)];
    }

    let bestMove: Move | undefined = validMoves[0];
    let bestScore = maximizingPlayer ? -Infinity : Infinity;
    let currentAlpha = alpha;
    let currentBeta = beta;

    // Search through moves with pruning
    for (const move of validMoves) {
        const score = evaluateMove(
            gameState,
            move,
            depth,
            currentAlpha,
            currentBeta,
            maximizingPlayer
        );

        // Update best move based on player type
        if (maximizingPlayer) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
            currentAlpha = Math.max(currentAlpha, score);
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
            currentBeta = Math.min(currentBeta, score);
        }

        // Alpha-beta pruning
        if (currentBeta <= currentAlpha) {
            break;
        }
    }

    return [bestMove, bestScore];
};
