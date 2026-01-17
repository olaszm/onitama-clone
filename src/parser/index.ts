import { Piece, Rank, File, Square, Move } from "../types/notation";
export class Cursor {
    constructor(
        public readonly input: string,
        public readonly pos: number = 0
    ) { }

    peek(): string | null {
        return this.pos < this.input.length
            ? this.input[this.pos]
            : null;
    }

    advance(n = 1): Cursor {
        return new Cursor(this.input, this.pos + n);
    }
}


export class ParseError extends Error {
    constructor(message: string, public readonly pos: number) {
        super(`${message} at position ${pos}`);
    }
}

export function expectChar(
    c: Cursor,
    expected: string
): Cursor {
    const ch = c.peek();
    if (ch === expected) {
        return c.advance();
    }
    throw new ParseError(
        `Expected '${expected}', got '${ch ?? "EOF"}'`,
        c.pos
    );
}

function parsePiece(c: Cursor): [Piece, Cursor] {
    const ch = c.peek();
    if (ch === "M" || ch === "S") {
        return [ch, c.advance()];
    }
    throw new ParseError(
        `Invalid piece '${ch ?? "EOF"}'`,
        c.pos
    );
}

function parseFile(c: Cursor): [File, Cursor] {
    const ch = c.peek();
    if (ch && "abcde".includes(ch)) {
        return [ch as File, c.advance()];
    }
    throw new ParseError(
        `Invalid file '${ch ?? "EOF"}'`,
        c.pos
    );
}


function parseRank(c: Cursor): [Rank, Cursor] {
    const ch = c.peek();
    if (ch && "12345".includes(ch)) {
        return [Number(ch) as Rank, c.advance()];
    }
    throw new ParseError(
        `Invalid rank '${ch ?? "EOF"}'`,
        c.pos
    );
}

function parseSquare(c: Cursor): [Square, Cursor] {
    const [file, cc] = parseFile(c)
    const [rank, ccc] = parseRank(cc)


    return [{ file, rank }, ccc]
}

function parseCapture(c: Cursor): [boolean, Cursor] {
    return c.peek() === "x" ? [true, c.advance()] : [false, c]
}

function parseWin(c: Cursor): [boolean, Cursor] {
    return c.peek() === "#" ? [true, c.advance()] : [false, c]
}


function parseCard(c: Cursor): [string, Cursor] {
    const start = c.pos;

    if (c.peek() !== "[") {
        throw new ParseError("Expected '['", c.pos);
    }

    const close = c.input.indexOf("]", start + 1);
    if (close === -1) {
        throw new ParseError("Unclosed card name", start);
    }

    const name = c.input.slice(start + 1, close);
    return [name, new Cursor(c.input, close + 1)];
}

export function parseMove(input: string): Move {
    let c = new Cursor(input);

    const [piece, c1] = parsePiece(c);
    const [from, c2] = parseSquare(c1);

    c = expectChar(c2, ">");

    const [to, c3] = parseSquare(c);

    const [capture, c4] = parseCapture(c3);
    const [card, c5] = parseCard(c4);
    const [isWin, c6] = parseWin(c5);

    if (c6.pos !== input.length) {
        throw new ParseError("Trailing characters", c6.pos);
    }

    return {
        piece,
        from,
        to,
        card,
        capture,
        isWin,
    };
}

export function moveToString(m: Move): string {
    return `${m.piece}${m.from.file}${m.from.rank}>${m.to.file}${m.to.rank}${m.capture ? "x" : ""}[${m.card}]${m.isWin ? "#" : ""}`
}

export function numberToFile(n: number): File {
    switch (n) {
        case 0:
            return "a"
        case 1:
            return "b"
        case 2:
            return "c"
        case 3:
            return "d"
        case 4:
            return "e"
        default:
            throw Error(`Cannot convert ${n} to a File`)
    }
}


export function numberToRank(n: number): Rank {
    if ([0, 1, 2, 3, 4,].includes(n)) {
        return n + 1 as Rank
    }


    throw Error(`Cannot conver ${n} to Rank (must be 0-4)`)
}
