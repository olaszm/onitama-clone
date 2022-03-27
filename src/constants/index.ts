import { Cell, MoveCard } from "../types";
import { flip2DArrayVertically } from "../utils/helpers";

// const RABBIT = [
// 	[0, 0, 0, 0, 0],
// 	[0, 0, 0, 1, 0],
// 	[0, 0, 3, 0, 1],
// 	[0, 1, 0, 0, 0],
// 	[0, 0, 0, 0, 0],
// ];

// const ROOSTER = [
// 	[0, 0, 0, 0, 0],
// 	[0, 0, 0, 1, 0],
// 	[0, 1, 3, 1, 0],
// 	[0, 1, 0, 0, 0],
// 	[0, 0, 0, 0, 0],
// ];

// const OX = [
// 	[0, 0, 0, 0, 0],
// 	[0, 0, 1, 0, 0],
// 	[0, 0, 3, 1, 0],
// 	[0, 0, 1, 0, 0],
// 	[0, 0, 0, 0, 0],
// ];

// const COBRA = [
// 	[0, 0, 0, 0, 0],
// 	[0, 0, 0, 1, 0],
// 	[0, 1, 3, 0, 0],
// 	[0, 0, 0, 1, 0],
// 	[0, 0, 0, 0, 0],
// ];

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

export const MOVES: MoveCard[] = [
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

const pieceFactory = (
	type: "pawn" | "king",
	side: "red" | "blue",
	isShrine: false | { side: "red" | "blue" }
): Cell => {
	return {
		isShrine,
		isValid: false,
		piece: {
			type,
			side,
		},
	};
};

const emptyCellFactory = (): Cell => {
	return { isShrine: false, isValid: false, piece: 0 }
}

export const INITIAL_BOARD: Cell[][] = [
	[
		pieceFactory("pawn", "blue", false),
		pieceFactory("pawn", "blue", false),
		pieceFactory("king", "blue", { side: "blue" }),
		pieceFactory("pawn", "blue", false),
		pieceFactory("pawn", "blue", false),
	],
	[
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
	],
	[
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
	],
	[
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
		emptyCellFactory(),
	],
	[
		pieceFactory("pawn", "red", false),
		pieceFactory("pawn", "red", false),
		pieceFactory("king", "red", { side: "red" }),
		pieceFactory("pawn", "red", false),
		pieceFactory("pawn", "red", false),
	],
];
