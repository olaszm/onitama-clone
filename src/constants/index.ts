import { MoveCard } from "../types";

const RABBIT = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 3, 0, 1],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

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

const COBRA = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 3, 0, 0],
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

const ROOSTER = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 3, 1, 0],
  [0, 1, 0, 0, 0],
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

const OX = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 3, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
];

const EEL = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 3, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

export const MOVES: MoveCard[] = [
  { name: "rabbit", moves: RABBIT },
  { name: "eel", moves: EEL },
  { name: "ox", moves: OX },
  { name: "frog", moves: FROG },
  { name: "triger", moves: TIGER },
  { name: "dragon", moves: DRAGON },
  { name: "mantis", moves: MANTIS },
  { name: "monkey", moves: MONKEY },
  { name: "boar", moves: BOAR },
  { name: "horse", moves: HORSE },
  { name: "elephant", moves: ELEPHANT },
  { name: "crane", moves: CRANE },
  { name: "cobra", moves: COBRA },
  { name: "crab", moves: CRAB },
  { name: "rooster", moves: ROOSTER },
  { name: "goose", moves: GOOSE },
];
