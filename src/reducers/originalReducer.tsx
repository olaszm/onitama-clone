import { generateBoard } from '../classes/BoardGenerator';
import { Board, GameAction, GameState, Piece, PieceAliasGrid, Player, Position, Difficulty } from '../types';
import { getTempleArch, posKey } from "../utils";
import { dealCards, selectRandomCards } from '../utils/cards';

export const commitMove = (state: GameState, action: GameAction): GameState => {
    const { from, to, cardUsed } = action;

    // Remove piece from 'from', place at 'to' (capturing if occupied)
    const newBoard = new Map(state.board);
    const piece = state.board.get(posKey(from))!;
    newBoard.delete(posKey(from));
    newBoard.set(posKey(to), piece);

    // Card rotation: used card goes to opponent's side
    const otherPlayer = state.currentPlayer === 'red' ? 'blue' : 'red';
    const currentCards = state.playerCards[state.currentPlayer];
    const remainingCard = currentCards.find(c => c.id !== cardUsed.id)!;

    return {
        ...state,
        board: newBoard,
        currentPlayer: otherPlayer,
        playerCards: {
            ...state.playerCards,
            [state.currentPlayer]: [remainingCard, state.sideCard] as const,
            [otherPlayer]: state.playerCards[otherPlayer]
        },
        sideCard: cardUsed,
        winner: checkWinner(newBoard, to, piece),
        winCondition: determineWinCondition(newBoard, to, piece)
    };
};

export const checkWinner = (
    board: Board,
    to: Position,
    piece: Piece
): Player | null => {
    // Way of the Stream: Master reaches opponent's Temple Arch
    if (piece.type === 'master') {
        const opponentArch = getTempleArch(
            piece.player === 'red' ? 'blue' : 'red'
        );
        if (to.row === opponentArch.row && to.col === opponentArch.col) {
            return piece.player;
        }
    }

    // Way of the Stone: Check if opponent's master was captured
    const opponentPlayer = piece.player === 'red' ? 'blue' : 'red';
    const opponentHasMaster = Array.from(board.values()).some(
        p => p.player === opponentPlayer && p.type === 'master'
    );

    if (!opponentHasMaster) {
        return piece.player;
    }

    return null;
};

export const determineWinCondition = (
    board: Board,
    to: Position,
    piece: Piece
): "way_of_stone" | "way_of_stream" | null => {
    // Way of the Stream: Master reaches opponent's Temple Arch
    if (piece.type === 'master') {
        const opponentArch = getTempleArch(
            piece.player === 'red' ? 'blue' : 'red'
        );
        if (to.row === opponentArch.row && to.col === opponentArch.col) {
            return 'way_of_stream';
        }
    }

    // Way of the Stone: Opponent's master was captured
    const opponentPlayer = piece.player === 'red' ? 'blue' : 'red';
    const opponentHasMaster = Array.from(board.values()).some(
        p => p.player === opponentPlayer && p.type === 'master'
    );

    if (!opponentHasMaster) {
        return 'way_of_stone';
    }

    return null;
};


const DEFAULT_BOARD: PieceAliasGrid = [
    ["bp", "bp", "bk", "bp", "bp"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["rp", "rp", "rk", "rp", "rp"],
];

export const newGame = (boardRep: PieceAliasGrid = DEFAULT_BOARD, difficulty: Difficulty = "Medium") => {
    const board = generateBoard(boardRep)
    const { red, blue, side } = dealCards(selectRandomCards())
    const initialGameState: GameState = {
        board,
        currentPlayer: "red",
        playerCards: {
            red: red,
            blue: blue,
        },
        sideCard: side,
        winner: null,
        winCondition: null,
        difficulty: difficulty
    }

    return initialGameState
}


export const reducer = (state: GameState, action: any) => {
    switch (action.type) {
        case "move_piece": {
            return commitMove(state, action)
        }
        case "restart_game": {
            return newGame(undefined, state.difficulty)
        }
        case "set_difficulty": {
            return newGame(undefined, action.difficulty)
        }
        default: {
            return state;
        }
    }
};
