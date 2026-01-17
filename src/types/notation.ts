export type File = "a" | "b" | "c" | "d" | "e"
export type Rank = 1 | 2 | 3 | 4 | 5
export type Piece = "M" | "S"

export type Square = {
    file: File
    rank: Rank
}

export interface Move {
    piece: Piece
    from: Square
    to: Square,
    card: string,
    capture: boolean,
    isWin: boolean
}

// [Piece][From]>[To][Capture?][Card]
//
// Full example 
// 1. Sc2>c3[Crab]   Sc4>c3x[Tiger]
// 2. Md1>d2[Dragon] Sd5>d4[Boar]
// 3. Md2>c3x[Crane]#
