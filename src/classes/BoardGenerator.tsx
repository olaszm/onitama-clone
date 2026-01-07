import { Board, Piece, PieceAlias, PieceAliasGrid, Position } from "../types"
import { posKey } from "../utils";

export const generateBoard = (boardRepresentation: PieceAliasGrid): Board => {
    const m = new Map()

    boardRepresentation.forEach((row, r_i) => {
        row.forEach((col, c_i) => {
            const pos: Position = { row: r_i, col: c_i }
            if (col === "empty") return
            const piece = pieceAliasToPiece(PieceAlias[col], pos)
            m.set(posKey(pos), piece)

        })
    })

    return m
}

const pieceAliasToPiece = (p: PieceAlias, pos: Position): Piece => {
    switch (p) {
        case PieceAlias.rk:
            return {
                player: "red",
                type: "master",
                position: pos
            } as Piece
        case PieceAlias.rp:
            return {
                player: "red",
                type: "student",
                position: pos
            } as Piece
        case PieceAlias.bk:
            return {
                player: "blue",
                type: "master",
                position: pos
            } as Piece
        case PieceAlias.bp:
            return {
                player: "blue",
                type: "student",
                position: pos
            } as Piece
        default:
            throw new Error("Invalid PieceAlias: " + p)
    }

}
