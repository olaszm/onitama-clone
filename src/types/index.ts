import { Move as NotationMove } from "./notation"
export type Player = "red" | "blue"
export type PieceType = "master" | "student"
export type PieceAliasGrid = Array<Array<keyof typeof PieceAlias>>;
export enum PieceAlias {
    "rk",
    "rp",
    "bk",
    "bp",
    "empty",
}
export type WinCondition = 'way_of_stone' | 'way_of_stream' | null;
export type Difficulty = "Easy" | "Medium" | "Impossible"

export interface Position {
    readonly row: number;
    readonly col: number;
}

export interface Piece {
    readonly player: Player;
    readonly type: PieceType;
    readonly position: Position;
}

export interface Move {
    readonly rowOffset: number;
    readonly colOffset: number;
}

export type Board = ReadonlyMap<string, Piece>;
export type MovementCard = {
    id: string;
    name: string;
    moves: readonly Move[];
    startingPlayer: Player;
}

export type GameState = {
    board: Board;
    history: NotationMove[];
    currentPlayer: Player;
    playerCards: {
        red: readonly [MovementCard, MovementCard];
        blue: readonly [MovementCard, MovementCard];
    };
    sideCard: MovementCard; // card waiting to be picked up
    winner: Player | null;
    winCondition: WinCondition;
    difficulty: Difficulty;
};

export type GameAction = {
    type: 'move_piece';
    from: Position;
    to: Position;
    cardUsed: MovementCard;
    toHistory?: boolean;
};

// UI-specific stat
export type UIState = {
    selectedPiece: Position | null;
    selectedCard: MovementCard | null;
    highlightedMoves: readonly Position[]; // valid moves to show
    hoveredPosition: Position | null;
    animatingMove: {
        from: Position;
        to: Position;
        progress: number; // 0-1 for animation
    } | null;
};

// Combined application state
export type AppState = {
    game: GameState;
    ui: UIState;
};

export type Placement = 'top' | 'bottom' | 'left' | 'right';
export interface TutorialStep {
    target: string;
    title: string;
    content: string;
    placement?: Placement;
}

export interface TooltipPosition {
    top: number;
    left: number;
}

export interface TutorialState {
    currentStep: number;
    isActive: boolean;
    completed: boolean;
    next: () => void;
    prev: () => void;
    skip: () => void;
    complete: () => void;
    start: () => void;
    goTo: (stepIndex: number) => void;
    totalSteps: number;
    currentStepData: TutorialStep | undefined;
}
