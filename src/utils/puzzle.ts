import { ALL_CARDS, dealCards } from "./cards";
import { GameState, MovementCard, NotationMove } from "../types";
import { newGame, commitMove } from "../reducers/originalReducer";
import { getBestMove } from ".";

const SALT = "onitama-daily-puzzle-v1";

export interface DailyPuzzle {
    date: string;
    initialState: GameState;
    solution: NotationMove[];
    puzzleState: GameState;
    currentPlayer: "red" | "blue";
}

export interface PuzzleProgress {
    date: string;
    elapsedTime: number;
    completed: boolean;
    hintsUsed: number;
    // Full game state snapshot instead of move history
    boardEntries: [string, any][];
    currentPlayer: "red" | "blue";
    playerCards: {
        red: readonly [MovementCard, MovementCard];
        blue: readonly [MovementCard, MovementCard];
    };
    sideCard: MovementCard;
    winner: "red" | "blue" | null;
    winCondition: "way_of_stone" | "way_of_stream" | null;
    history: NotationMove[];
}

function cyrb53(str: string, seed = 0): number {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch: number; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function getDateHash(date: Date): number {
    const dateStr = date.toISOString().split("T")[0];
    return cyrb53(`${dateStr}-${SALT}`);
}

export function seededRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function selectCardsWithSeed(seed: number): readonly [MovementCard, MovementCard, MovementCard, MovementCard, MovementCard] {
    const shuffled = [...ALL_CARDS].sort(() => seededRandom(seed++) - 0.5);
    return [shuffled[0], shuffled[1], shuffled[2], shuffled[3], shuffled[4]];
}

export function generatePuzzleGame(seed: number): GameState {
    const cards = selectCardsWithSeed(seed);
    const { red, blue, side } = dealCards(cards);
    const board = newGame().board;

    return {
        board,
        history: [],
        currentPlayer: side.startingPlayer,
        playerCards: { red, blue },
        initialPlayerCards: { red, blue, side },
        sideCard: side,
        winner: null,
        winCondition: null,
        difficulty: "Medium",
    };
}

export function simulateMediumVsMedium(initialState: GameState): { state: GameState; solution: NotationMove[] } {
    let state = { ...initialState };
    const solution: NotationMove[] = [];

    while (!state.winner) {
        const bestMove = getBestMove(state, 3);
        if (!bestMove) break;

        state = commitMove(state, { ...bestMove, toHistory: true });
        if (state.history.length > 0) {
            solution.push(state.history[state.history.length - 1]);
        }
    }

    return { state, solution };
}

export function createDailyPuzzle(date: Date = new Date()): DailyPuzzle | null {
    const dateStr = date.toISOString().split("T")[0];
    const seed = getDateHash(date);

    let initialState = generatePuzzleGame(seed);
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
        const result = simulateMediumVsMedium(initialState);

        if (result.solution.length >= 4) {
            const puzzleMoves = result.solution.slice(0, -2);

            let puzzleState: GameState = { ...initialState, history: [] as NotationMove[] };
            for (const move of puzzleMoves) {
                const action = convertNotationToAction(move, puzzleState);
                if (action) {
                    puzzleState = commitMove(puzzleState, { ...action, toHistory: true });
                }
            }

            const currentPlayer = puzzleState.currentPlayer;

            return {
                date: dateStr,
                initialState: result.state,
                solution: result.solution,
                puzzleState,
                currentPlayer,
            };
        }

        attempts++;
        initialState = generatePuzzleGame(seed + attempts * 1000);
    }

    return null;
}

function convertNotationToAction(notation: NotationMove, state: GameState) {
    const from = {
        row: notation.from.rank - 1,
        col: notation.from.file.charCodeAt(0) - 97,
    };
    const to = {
        row: notation.to.rank - 1,
        col: notation.to.file.charCodeAt(0) - 97,
    };

    const playerCards = state.playerCards[state.currentPlayer];
    const cardUsed = playerCards.find((c) => c.name === notation.card);

    if (!cardUsed) return null;

    return {
        type: "move_piece" as const,
        from,
        to,
        cardUsed,
    };
}

export function getNextMoveFromSolution(puzzle: DailyPuzzle, currentHistoryLength: number): NotationMove | null {
    const solutionIndex = currentHistoryLength;
    if (solutionIndex < 0 || solutionIndex >= puzzle.solution.length) {
        return null;
    }
    return puzzle.solution[solutionIndex];
}

const STORAGE_KEY = "onitama-daily-puzzle";
const PROGRESS_KEY = "onitama-daily-puzzle-progress";

export function savePuzzleToCache(puzzle: DailyPuzzle): void {
    try {
        const serializablePuzzle = {
            ...puzzle,
            initialState: {
                ...puzzle.initialState,
                board: serializeBoard(puzzle.initialState.board),
            },
            puzzleState: {
                ...puzzle.puzzleState,
                board: serializeBoard(puzzle.puzzleState.board),
            },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePuzzle));
    } catch (e) {
        console.error("Failed to save puzzle to cache:", e);
    }
}

function serializeBoard(board: ReadonlyMap<string, any>): [string, any][] {
    return Array.from(board.entries());
}

function deserializeBoard(entries: [string, any][]): Map<string, any> {
    return new Map(entries);
}

export function loadPuzzleFromCache(): DailyPuzzle | null {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (!cached) return null;

        const puzzleData = JSON.parse(cached);
        const today = new Date().toISOString().split("T")[0];

        if (puzzleData.date !== today) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(PROGRESS_KEY);
            return null;
        }

        // Validate board data
        if (!Array.isArray(puzzleData.initialState?.board) || !Array.isArray(puzzleData.puzzleState?.board)) {
            console.error("Invalid puzzle cache: board is not an array");
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(PROGRESS_KEY);
            return null;
        }

        const puzzle: DailyPuzzle = {
            date: puzzleData.date,
            initialState: {
                ...puzzleData.initialState,
                board: deserializeBoard(puzzleData.initialState.board),
            },
            solution: puzzleData.solution,
            puzzleState: {
                ...puzzleData.puzzleState,
                board: deserializeBoard(puzzleData.puzzleState.board),
            },
            currentPlayer: puzzleData.currentPlayer,
        };

        return puzzle;
    } catch (e) {
        console.error("Failed to load puzzle from cache:", e);
        return null;
    }
}

export function clearPuzzleCache(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROGRESS_KEY);
}

export function getOrCreateDailyPuzzle(): DailyPuzzle | null {
    const cached = loadPuzzleFromCache();
    if (cached) {
        // Validate that the cached puzzle has proper Map boards
        try {
            if (!(cached.puzzleState.board instanceof Map)) {
                console.error("Cached puzzle board is not a Map, clearing cache");
                clearPuzzleCache();
            } else {
                return cached;
            }
        } catch (e) {
            console.error("Error validating cached puzzle, clearing cache:", e);
            clearPuzzleCache();
        }
    }

    const puzzle = createDailyPuzzle();
    if (puzzle) {
        savePuzzleToCache(puzzle);
    }
    return puzzle;
}

export function savePuzzleProgress(progress: PuzzleProgress): void {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
        console.error("Failed to save puzzle progress:", e);
    }
}

export function loadPuzzleProgress(): PuzzleProgress | null {
    try {
        const cached = localStorage.getItem(PROGRESS_KEY);
        if (!cached) return null;

        const progress = JSON.parse(cached) as PuzzleProgress;
        const today = new Date().toISOString().split("T")[0];

        if (progress.date !== today) {
            localStorage.removeItem(PROGRESS_KEY);
            return null;
        }

        return progress;
    } catch (e) {
        console.error("Failed to load puzzle progress:", e);
        return null;
    }
}
