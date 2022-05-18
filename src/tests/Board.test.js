import { Board, BoardGenerator, IBoardReprGrid } from "../classes/BoardClass"
import { Cell, CellFactory } from "../classes/CellClass"

const boardRep = [
    ["bp", "bp", "bks", "bp", "bp"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["rp", "rp", "rks", "rp", "rp"],
];


test('board should have a current player', () => {
    const b = new Board('red', CellFactory)

    expect(b.currentPlayer).toBe('red')
})


test('board should swap current player', () => {
    const b = new Board('red', CellFactory)
    expect(b.currentPlayer).toBe('red')
    b.swapCurrentPlayers()
    expect(b.currentPlayer).toBe('blue')
})



test('board should keep track if is game over', () => {
    // const f = new CellFactory()
    const b = new Board('red', CellFactory)

    expect(b.isGameOver).toBe(false)
})


test('board should return a cell by (X,Y)', () => {
    const boardGenerator = new BoardGenerator(boardRep)
    const b = new Board('red', boardGenerator.board)
    expect(b.board.length).toBe(5)
    
    expect(b.getCellByPosition(0, 0)).toBeInstanceOf(Cell)
    expect(b.getCellByPosition(2, 2)._piece).toBe(undefined)
    expect(b.getCellByPosition(4,2)._piece.type).toBe('king')
})



test('board should throw an error if position (X,Y) not valid', () => {
    const b = new Board('red', CellFactory)

    expect(() => b.getCellByPosition(20, 42)).toThrowError(new Error('Out of bound'))
})

test('players should have list of movecards', () => {
    const b = new Board('red')
    b.startGame()

    expect(b.rotatingCard).toBeTruthy()
    expect(b.bluePlayerMoveCards.length).toBe(2)
    expect(b.bluePlayerMoveCards.length).toBe(2)
})