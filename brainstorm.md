```ts 

export const minimax = (
	gameBoard: Array<GameBoardItem>,
	depth: number,
	isMaximizing: boolean
) => {
    
    const scores = {
        false: 1,
        true: -1,
        tie: 0,
    };


    let result = checkForWinner(gameBoard)
    if(result !== null || depth === 0) {
        if(result === 'tie') {
            return scores['tie']
        } else if(result) {
            return scores['true']
        } else {
            return scores['false']
        }
    }


    if(isMaximizing){
        let maxEval = -Infinity
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === null)  {
                let copyBoard = [...gameBoard];
                // Make move
                copyBoard[i] = false;
                let score = minimax(copyBoard, depth - 1, false)
                maxEval = Math.max(maxEval, score)
            }
        }
        return maxEval
    } else {
        let minEval = Infinity
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === null) {
                let copyBoard = [...gameBoard];
                // Make move
                copyBoard[i] = true;
                let score = minimax(copyBoard, depth - 1, true)
                minEval = Math.min(minEval, score)
            }
        }
        return minEval
    }
};

```


Should get every valid movement with all pieces and both move cards
Should play out each movement
Score each valid movement
Scoring system ? What's a good move?



