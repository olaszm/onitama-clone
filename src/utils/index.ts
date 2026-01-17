import { commitMove } from "../reducers/originalReducer";
import { Board, GameAction, GameState, MovementCard, Piece, Player, Position } from "../types";

export const posKey = (pos: Position): string => `${pos.row},${pos.col}`;

export const getTempleArch = (player: Player): Position =>
    player === 'red'
        ? { row: 4, col: 2 }
        : { row: 0, col: 2 };

export const isShrineCellPosition = (pos: Position): boolean => {
    return isTopShrine(pos) || isBottomShrine(pos)
}

export const isTopShrine = (pos: Position): boolean => {
    // 5x5 grid middle column & bottom top
    return pos.col === 2 && pos.row === 0
}

export const isBottomShrine = (pos: Position): boolean => {
    // 5x5 grid middle column & bottom row
    return pos.col === 2 && pos.row === 4
}


// Evaluation function - assigns score to a game state
const evaluateState = (state: GameState, maximizingPlayer: Player): number => {
    if (state.winner) {
        return state.winner === maximizingPlayer ? 10000 : -10000;
    }

    let score = 0;
    const pieces = Array.from(state.board.values());

    for (const piece of pieces) {
        const pieceValue = piece.type === 'master' ? 100 : 10;
        const positionBonus = calculatePositionBonus(piece, state.board);

        if (piece.player === maximizingPlayer) {
            score += pieceValue + positionBonus;
        } else {
            score -= pieceValue + positionBonus;
        }
    }

    return score;
};

// Position bonus - favor advancing master toward opponent's temple
const calculatePositionBonus = (piece: Piece, board: Board): number => {
    if (piece.type !== 'master') return 0;

    const opponentArch = piece.player === 'red'
        ? { row: 0, col: 2 }
        : { row: 4, col: 2 };

    const position = findPiecePosition(board, piece);
    if (!position) return 0;

    // Manhattan distance to opponent's temple (closer is better)
    const distance = Math.abs(position.row - opponentArch.row) + Math.abs(position.col - opponentArch.col);

    return (10 - distance) * 5; // Max 50 bonus for being on temple
};

const findPiecePosition = (board: Board, piece: Piece): Position | null => {
    for (const [key, p] of board.entries()) {
        if (p === piece) {
            const [row, col] = key.split(',').map(Number);
            return { row, col };
        }
    }
    return null;
};

// Generate all legal moves for current player
const getAllLegalMoves = (state: GameState): GameAction[] => {
    const moves: GameAction[] = [];
    const currentPlayer = state.currentPlayer;
    const playerCards = state.playerCards[currentPlayer];

    for (const card of playerCards) {
        for (const [key, piece] of state.board.entries()) {
            if (piece.player !== currentPlayer) continue;

            const [row, col] = key.split(',').map(Number);
            const from = { row, col };
            const validMoves = getValidMoves(state.board, from, card, currentPlayer);

            for (const to of validMoves) {
                moves.push({
                    type: 'move_piece',
                    from,
                    to,
                    cardUsed: card
                });
            }
        }
    }

    return moves;
};

// Helper to get valid moves for a piece with a card
const getValidMoves = (
    board: Board,
    from: Position,
    card: MovementCard,
    player: Player
): Position[] => {
    const posKey = (pos: Position): string => `${pos.row},${pos.col}`;

    return card.moves
        .map(move => ({
            row: from.row + (player === 'blue' ? move.rowOffset : -move.rowOffset),
            col: from.col + move.colOffset
        }))
        .filter(pos => pos.row >= 0 && pos.row < 5 && pos.col >= 0 && pos.col < 5)
        .filter(pos => {
            const target = board.get(posKey(pos));
            return !target || target.player !== player;
        });
};

// Alpha-beta pruning minimax
function alphabeta(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    maximizingPlayer: Player
): number {
    // Terminal conditions
    if (depth === 0 || state.winner !== null) {
        return evaluateState(state, maximizingPlayer);
    }

    const legalMoves = getAllLegalMoves(state);

    // No legal moves (stalemate - shouldn't happen in Onitama)
    if (legalMoves.length === 0) {
        return evaluateState(state, maximizingPlayer);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;

        for (const move of legalMoves) {
            const newState = commitMove(state, move);
            const eval_ = alphabeta(newState, depth - 1, alpha, beta, false, maximizingPlayer);
            maxEval = Math.max(maxEval, eval_);
            alpha = Math.max(alpha, eval_);

            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }

        return maxEval;
    } else {
        let minEval = Infinity;

        for (const move of legalMoves) {
            const newState = commitMove(state, move);
            const eval_ = alphabeta(newState, depth - 1, alpha, beta, true, maximizingPlayer);
            minEval = Math.min(minEval, eval_);
            beta = Math.min(beta, eval_);

            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }

        return minEval;
    }
}

// AI move selection - finds best move using alphabeta
export const getBestMove = (
    state: GameState,
    depth: number = 3
): GameAction | null => {
    const legalMoves = getAllLegalMoves(state);

    if (legalMoves.length === 0) return null;

    let bestMove = legalMoves[0];
    let bestValue = -Infinity;
    const maximizingPlayer = state.currentPlayer;

    for (const move of legalMoves) {
        const newState = commitMove(state, move);
        const moveValue = alphabeta(
            newState,
            depth - 1,
            -Infinity,
            Infinity,
            false,
            maximizingPlayer
        );

        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }

    return { ...bestMove, toHistory: true };
};
