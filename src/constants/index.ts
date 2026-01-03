import { TMoveCard } from "../types";
import { flip2DArrayVertically } from "../utils";

export const MONKEY = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 3, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
];

export const BOAR = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 3, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

export const GOOSE = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 3, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
];

export const CRAB = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 0, 3, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

export const HORSE = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 3, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
];

export const DRAGON = [
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 3, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
];

export const CRANE = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 3, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
];

export const ELEPHANT = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 3, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

export const MANTIS = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 3, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
];

export const TIGER = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
];

export const FROG = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 3, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
];

export const EEL = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 3, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

export const RABBIT = flip2DArrayVertically(FROG);
export const ROOSTER = flip2DArrayVertically(GOOSE);
export const OX = flip2DArrayVertically(HORSE);
export const COBRA = flip2DArrayVertically(EEL);

export const ULTIMATE: number[][] = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 3, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
];

export const MOVES: TMoveCard[] = [
    { name: "crane", moves: CRANE },
    { name: "cobra", moves: COBRA },
    { name: "crab", moves: CRAB },
    { name: "rooster", moves: ROOSTER },
    { name: "goose", moves: GOOSE },
    // { name: "ultimate", moves: ULTIMATE },
    { name: "rabbit", moves: RABBIT },
    { name: "eel", moves: EEL },
    { name: "ox", moves: OX },
    { name: "frog", moves: FROG },
    { name: "tiger", moves: TIGER },
    { name: "dragon", moves: DRAGON },
    { name: "mantis", moves: MANTIS },
    { name: "monkey", moves: MONKEY },
    { name: "boar", moves: BOAR },
    { name: "horse", moves: HORSE },
    { name: "elephant", moves: ELEPHANT },
];
