import assert from "assert"
import { Move } from "../types/notation"
import { ParseError, parseMove, moveToString } from "."

describe("Parse", () => {
    it("Should parse move correctly", () => {
        const move = parseMove("Sc2>c3[Crab]")

        assert(move.piece === "S")
        assert(move.from.file === "c" && move.from.rank === 2)
        assert(move.to.file === "c" && move.to.rank === 3)
        assert(move.isWin === false)
        assert(move.capture === false)
    })

    it("Should parse capture correctly", () => {
        const move = parseMove("Sc4>c3x[Tiger]")
        expect(move.capture).toBe(true)
        expect(move.to).toStrictEqual({ file: "c", rank: 3 })
    })

    it("Should parse win correctly", () => {
        const move = parseMove("Md2>c3x[Crane]#")
        expect(move.isWin).toBe(true)
        expect(move.capture).toBe(true)
        expect(move.to).toStrictEqual({ file: "c", rank: 3 })
    })

    it("Should handle incorrect file", () => {
        expect(() => parseMove("Mk2>c3x[Crane]#")).toThrow(ParseError)
        expect(() => parseMove("Md2>i3x[Crane]#")).toThrow(ParseError)
    })

    it("Should handle incorrect rank", () => {
        expect(() => parseMove("Md9>c3x[Crane]#")).toThrow(ParseError)
        expect(() => parseMove("Md2>c9x[Crane]#")).toThrow(ParseError)
    })

    it("Incorrect move card should throw", () => {
        expect(() => parseMove("Sc2>c3[Cra")).toThrow(ParseError)
        expect(() => parseMove("Sc2>c3[Cra")).toThrow("Unclosed card name at position 6")
    })

    it("Incorrect move card start should throw", () => {
        expect(() => parseMove("Sc2>c3Crab]")).toThrow(ParseError)
        expect(() => parseMove("Sc2>c3Crab]")).toThrow("Expected '[' at position 6")
    })

    it("Missing >", () => {
        expect(() => parseMove("Sc2c3[Crab]")).toThrow(ParseError)
    })

    it("Trailing garbage", () => {
        expect(() => parseMove("Sc2c3>[Crab]aasdfasdf")).toThrow(ParseError)
    })

    it("Beginning garbage", () => {
        expect(() => parseMove("XxxXSc2c3>[Crab]")).toThrow(ParseError)
    })
}
)

describe("Move to string", () => {
    it("Simple move to str", () => {
        const m: Move = {
            piece: "S",
            from: { file: "c", rank: 2 },
            to: { file: "c", rank: 3 },
            card: "Crab",
            isWin: false,
            capture: false
        }
        expect(moveToString(m)).toBe("Sc2>c3[Crab]")
    })

    it("Move to str with capture", () => {
        const m: Move = {
            piece: "S",
            from: { file: "c", rank: 2 },
            to: { file: "c", rank: 3 },
            card: "Crab",
            isWin: false,
            capture: true
        }
        expect(moveToString(m)).toBe("Sc2>c3x[Crab]")
    })

    it("Move to str with win", () => {
        const m: Move = {
            piece: "S",
            from: { file: "c", rank: 2 },
            to: { file: "c", rank: 3 },
            card: "Crab",
            isWin: true,
            capture: false
        }
        expect(moveToString(m)).toBe("Sc2>c3[Crab]#")
    })

    it("Move to str with win and capture", () => {
        const m: Move = {
            piece: "S",
            from: { file: "c", rank: 2 },
            to: { file: "c", rank: 3 },
            card: "Crab",
            isWin: true,
            capture: true
        }
        expect(moveToString(m)).toBe("Sc2>c3x[Crab]#")
    })
})
