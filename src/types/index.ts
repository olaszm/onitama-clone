import { Cell } from '../classes/CellClass'

export interface Position {
    x: number;
    y: number;
}

export type TMoveCard = {
    name: string;
    moves: number[][];
};

export type CellType = Piece | 0;

export interface Piece {
    type: "pawn" | "king";
    side: "red" | "blue";
}

export type CellProps = {
    handleClick: (position: Position) => void;
    isSelected: boolean;
    position: Position;
    piece: Cell;
};


export type MoveElementProp = {
    isActive: boolean;
    isMuted?: boolean;
    move: TMoveCard | undefined;
}

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

