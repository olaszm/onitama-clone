import { generateBoard } from '../classes/BoardGenerator';
import { NotationMove, File, Rank, MovementCard } from '../types';
import { Board, GameAction, GameState, Piece, PieceAliasGrid, Player, Position, Difficulty } from '../types';
import { getTempleArch, posKey } from "../utils";
import { dealCards, selectRandomCards, ALL_CARDS } from '../utils/cards';
import { numberToFile, numberToRank } from '../parser';

// Helper functions to convert file/rank to row/col
export const fileToNumber = (file: File): number => {
    const map: Record<File, number> = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 };
    return map[file];
};

export const rankToNumber = (rank: Rank): number => {
    return rank - 1;
};

// Reconstruct board state at a specific point in history
export const getBoardAtHistoryIndex = (
    initialBoard: Board,
    history: NotationMove[],
    index: number
): Board => {
    if (index < 0 || index >= history.length) {
        return initialBoard;
    }

    const board = new Map(initialBoard);
    
    for (let i = 0; i <= index; i++) {
        const move = history[i];
        const fromPos: Position = { 
            row: rankToNumber(move.from.rank), 
            col: fileToNumber(move.from.file) 
        };
        const toPos: Position = { 
            row: rankToNumber(move.to.rank), 
            col: fileToNumber(move.to.file) 
        };
        
        const piece = board.get(posKey(fromPos));
        if (piece) {
            board.delete(posKey(fromPos));
            board.set(posKey(toPos), { ...piece, position: toPos });
        }
    }
    
    return board;
};

// Reconstruct game state at a specific history point (includes cards and current player)
export const getGameStateAtHistoryIndex = (
    currentState: GameState,
    index: number
): Partial<GameState> => {
    if (index < 0 || index >= currentState.history.length) {
        return {};
    }

    // Calculate board at this point
    const initialBoard = generateBoard([
        ["bp", "bp", "bk", "bp", "bp"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "empty", "empty"],
        ["rp", "rp", "rk", "rp", "rp"],
    ]);
    const board = getBoardAtHistoryIndex(initialBoard, currentState.history, index);

    // Calculate current player (alternates starting from the starting player)
    const startingPlayer = currentState.initialPlayerCards.side.startingPlayer;
    const movesSinceStart = index + 1;
    const currentPlayer: Player = movesSinceStart % 2 === 0 ? startingPlayer : (startingPlayer === 'red' ? 'blue' : 'red');

    // Calculate card state by replaying moves from the initial deal
    let redCards: readonly [MovementCard, MovementCard] = currentState.initialPlayerCards.red;
    let blueCards: readonly [MovementCard, MovementCard] = currentState.initialPlayerCards.blue;
    let sideCard = currentState.initialPlayerCards.side;
    
    for (let i = 0; i <= index; i++) {
        const move = currentState.history[i];
        const moveNumber = i + 1;
        const isStartingPlayerMove = moveNumber % 2 === 1;
        const movingPlayer: Player = isStartingPlayerMove ? startingPlayer : (startingPlayer === 'red' ? 'blue' : 'red');
        const currentCards = movingPlayer === 'red' ? redCards : blueCards;
        
        // Find which card was used
        const usedCard = currentCards.find(c => c.name === move.card);
        if (usedCard) {
            const remainingCard = currentCards.find(c => c.id !== usedCard.id)!;
            
            if (movingPlayer === 'red') {
                redCards = [remainingCard, sideCard] as const;
            } else {
                blueCards = [remainingCard, sideCard] as const;
            }
            sideCard = usedCard;
        }
    }

    return {
        board,
        currentPlayer,
        playerCards: { red: redCards, blue: blueCards },
        sideCard,
        winner: null,
        winCondition: null
    };
};

export const commitMove = (state: GameState, action: GameAction): GameState => {
    const { from, to, cardUsed, toHistory } = action;

    // Remove piece from 'from', place at 'to' (capturing if occupied)
    const newBoard = new Map(state.board);
    const piece = state.board.get(posKey(from))!;
    const isCapture = state.board.get(posKey(to)) !== undefined;
    newBoard.delete(posKey(from));
    newBoard.set(posKey(to), piece);

    // Card rotation: used card goes to opponent's side
    const otherPlayer = state.currentPlayer === 'red' ? 'blue' : 'red';
    const currentCards = state.playerCards[state.currentPlayer];
    const remainingCard = currentCards.find(c => c.id !== cardUsed.id)!;

    const isWin = checkWinner(newBoard, to, piece)
    const historyCopy = [...state.history]
    if (toHistory) {
        const notationMove: NotationMove = {
            piece: piece.type,
            from: { file: numberToFile(from.col), rank: numberToRank(from.row) },
            to: { file: numberToFile(to.col), rank: numberToRank(to.row) },
            capture: isCapture,
            isWin: isWin !== null,
            card: cardUsed.name
        }
        historyCopy.push(notationMove)
    }

    return {
        ...state,
        board: newBoard,
        history: historyCopy,
        currentPlayer: otherPlayer,
        playerCards: {
            ...state.playerCards,
            [state.currentPlayer]: [remainingCard, state.sideCard] as const,
            [otherPlayer]: state.playerCards[otherPlayer]
        },
        sideCard: cardUsed,
        winner: isWin,
        winCondition: determineWinCondition(newBoard, to, piece)
    };
};

export const checkWinner = (
    board: Board,
    to: Position,
    piece: Piece
): Player | null => {
    // Way of the Stream: Master reaches opponent's Temple Arch
    if (piece.type === 'M') {
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
        p => p.player === opponentPlayer && p.type === 'M'
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
    if (piece.type === 'M') {
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
        p => p.player === opponentPlayer && p.type === 'M'
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
        history: [],
        currentPlayer: side.startingPlayer,
        playerCards: {
            red: red,
            blue: blue,
        },
        initialPlayerCards: {
            red: red,
            blue: blue,
            side: side,
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
        case "load_puzzle": {
            return action.puzzle
        }
        default: {
            return state;
        }
    }
};
