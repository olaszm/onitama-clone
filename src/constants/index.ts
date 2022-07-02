import { TMoveCard } from "../types";
import { flip2DArrayVertically } from "../utils";

const MONKEY = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 0, 3, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0],
];

const BOAR = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 1, 3, 1, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
];

const GOOSE = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 1, 3, 1, 0],
	[0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0],
];

const CRAB = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[1, 0, 3, 0, 1],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
];

const HORSE = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 1, 3, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0],
];

const DRAGON = [
	[0, 0, 0, 0, 0],
	[1, 0, 0, 0, 1],
	[0, 0, 3, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0],
];

const CRANE = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 3, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0],
];

const ELEPHANT = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 1, 3, 1, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0],
];

const MANTIS = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0],
	[0, 0, 3, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0],
];

const TIGER = [
	[0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0],
	[0, 0, 3, 0, 0],
	[0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0],
];

const FROG = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[1, 0, 3, 0, 0],
	[0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0],
];

const EEL = [
	[0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 3, 1, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0],
];

const RABBIT = flip2DArrayVertically(FROG);
const ROOSTER = flip2DArrayVertically(GOOSE);
const OX = flip2DArrayVertically(HORSE);
const COBRA = flip2DArrayVertically(EEL);

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
