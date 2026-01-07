import { posKey } from ".";
import { Board, Move, MovementCard, Player, Position } from "../types";

// Get valid moves for a piece using a card
export const getValidMoves = (
    board: Board,
    from: Position,
    card: MovementCard,
    player: Player
): Position[] => {
    return card.moves
        .map(move => (applyMove(from, move, player)))
        .filter(pos => isInBounds(pos))
        .filter(pos => {
            const target = board.get(posKey(pos));
            return !target || target.player !== player; // can't capture own piece
        });
};

export const isInBounds = (pos: Position): boolean =>
    pos.row >= 0 && pos.row < 5 && pos.col >= 0 && pos.col < 5;

export const applyMove = (from: Position, move: Move, player: Player): Position => ({
    row: from.row + (player === 'blue' ? move.rowOffset : -move.rowOffset),
    col: from.col + move.colOffset
});

export const selectRandomCards = (cards: readonly MovementCard[] = ALL_CARDS): readonly [MovementCard, MovementCard, MovementCard, MovementCard, MovementCard] => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1], shuffled[2], shuffled[3], shuffled[4]];
};

export const dealCards = (
    fiveCards: readonly [MovementCard, MovementCard, MovementCard, MovementCard, MovementCard]
): {
    red: readonly [MovementCard, MovementCard];
    blue: readonly [MovementCard, MovementCard];
    side: MovementCard;
} => {
    return {
        red: [fiveCards[0], fiveCards[1]],
        blue: [fiveCards[2], fiveCards[3]],
        side: fiveCards[4]
    };
};

export const TIGER: MovementCard = {
    id: 'tiger',
    name: 'Tiger',
    moves: [
        { rowOffset: 2, colOffset: 0 },   // forward 2
        { rowOffset: -1, colOffset: 0 }   // back 1
    ],
    startingPlayer: 'blue'
};

export const DRAGON: MovementCard = {
    id: 'dragon',
    name: 'Dragon',
    moves: [
        { rowOffset: 1, colOffset: -2 },  // forward-left diagonal
        { rowOffset: 1, colOffset: 2 },   // forward-right diagonal
        { rowOffset: -1, colOffset: -1 }, // back-left
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'red'
};

export const FROG: MovementCard = {
    id: 'frog',
    name: 'Frog',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 0, colOffset: -2 },  // left 2
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'red'
};

export const RABBIT: MovementCard = {
    id: 'rabbit',
    name: 'Rabbit',
    moves: [
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: 0, colOffset: 2 },   // right 2
        { rowOffset: -1, colOffset: -1 }  // back-left
    ],
    startingPlayer: 'blue'
};

export const CRAB: MovementCard = {
    id: 'crab',
    name: 'Crab',
    moves: [
        { rowOffset: 1, colOffset: 0 },   // forward
        { rowOffset: 0, colOffset: -2 },  // left 2
        { rowOffset: 0, colOffset: 2 }    // right 2
    ],
    startingPlayer: 'blue'
};

export const ELEPHANT: MovementCard = {
    id: 'elephant',
    name: 'Elephant',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: 0, colOffset: 1 }    // right
    ],
    startingPlayer: 'red'
};

export const GOOSE: MovementCard = {
    id: 'goose',
    name: 'Goose',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: 0, colOffset: 1 },   // right
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'blue'
};

export const ROOSTER: MovementCard = {
    id: 'rooster',
    name: 'Rooster',
    moves: [
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: 0, colOffset: 1 },   // right
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: -1, colOffset: -1 }  // back-left
    ],
    startingPlayer: 'red'
};

export const MONKEY: MovementCard = {
    id: 'monkey',
    name: 'Monkey',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: -1, colOffset: -1 }, // back-left
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'blue'
};

export const MANTIS: MovementCard = {
    id: 'mantis',
    name: 'Mantis',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: -1, colOffset: 0 }   // back
    ],
    startingPlayer: 'red'
};

export const HORSE: MovementCard = {
    id: 'horse',
    name: 'Horse',
    moves: [
        { rowOffset: 1, colOffset: 0 },   // forward
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: -1, colOffset: 0 }   // back
    ],
    startingPlayer: 'red'
};

export const OX: MovementCard = {
    id: 'ox',
    name: 'Ox',
    moves: [
        { rowOffset: 1, colOffset: 0 },   // forward
        { rowOffset: 0, colOffset: 1 },   // right
        { rowOffset: -1, colOffset: 0 }   // back
    ],
    startingPlayer: 'blue'
};

export const CRANE: MovementCard = {
    id: 'crane',
    name: 'Crane',
    moves: [
        { rowOffset: 1, colOffset: 0 },   // forward
        { rowOffset: -1, colOffset: -1 }, // back-left
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'blue'
};

export const BOAR: MovementCard = {
    id: 'boar',
    name: 'Boar',
    moves: [
        { rowOffset: 1, colOffset: 0 },   // forward
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: 0, colOffset: 1 }    // right
    ],
    startingPlayer: 'red'
};

export const EEL: MovementCard = {
    id: 'eel',
    name: 'Eel',
    moves: [
        { rowOffset: 1, colOffset: -1 },  // forward-left
        { rowOffset: 0, colOffset: 1 },   // right
        { rowOffset: -1, colOffset: -1 }  // back-left
    ],
    startingPlayer: 'blue'
};

export const COBRA: MovementCard = {
    id: 'cobra',
    name: 'Cobra',
    moves: [
        { rowOffset: 1, colOffset: 1 },   // forward-right
        { rowOffset: 0, colOffset: -1 },  // left
        { rowOffset: -1, colOffset: 1 }   // back-right
    ],
    startingPlayer: 'red'
};

// All cards as an array for random selection
export const ALL_CARDS: readonly MovementCard[] = [
    TIGER, DRAGON, FROG, RABBIT, CRAB, ELEPHANT, GOOSE, ROOSTER,
    MONKEY, MANTIS, HORSE, OX, CRANE, BOAR, EEL, COBRA
] as const;
