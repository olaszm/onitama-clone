import { flip2DArrayHorizontally, flip2DArrayVertically } from "../utils";

class MoveCardC {
	name: string;
	moves: number[][];
	isSwapped: boolean;
	constructor(name: string, moves: number[][], isSwapped = false) {
		this.name = name;
		this.moves = moves;
		this.isSwapped = isSwapped;
	}

	getCard() {
		return this;
	}

	rotateMoves(): MoveCardC {
		this.isSwapped = !this.isSwapped;

		this.moves = flip2DArrayHorizontally(flip2DArrayVertically(this.moves));
        
        return this
    }
}

export default MoveCardC;
