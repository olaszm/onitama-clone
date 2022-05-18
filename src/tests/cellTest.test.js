import { Cell, CellFactory } from "../classes/CellClass";

test("should return a cell object", () => {
	const factory = new CellFactory();
	const c = factory.createCell({
		piece: {},
		isShrine: false,
		isValid: false,
	});

	expect(c instanceof Cell).toBe(true);
});

test("should return a cell red king on shrine", () => {
	const factory = new CellFactory();
	const c = factory.createCell({
		piece: { side: "red", type: "king" },
		isShrine: true,
		isValid: false,
	});

    expect(c._piece.side).toBe('red')
    expect(c._piece.type).toBe('king')
    expect(c.getIsShrine()).toBe(true)
});


test("should return a cell blue prawn valid move", () => {
	const factory = new CellFactory();
	const c = factory.createCell({
		piece: { side: "blue", type: "pawn" },
		isShrine: false,
		isValid: true,
	});

    expect(c._piece.side).toBe('blue')
    expect(c._piece.type).toBe('pawn')
    expect(c.getIsShrine()).toBe(false)
    expect(c.getIsValid()).toBe(true)
});