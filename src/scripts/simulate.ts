import { newGame, commitMove } from '../reducers/originalReducer';
import { getBestMove } from '../utils';
import { Difficulty, Player } from '../types';

interface SimulationConfig {
    numGames: number;
    difficultyPairs: Array<{
        red: Difficulty;
        blue: Difficulty;
    }>;
}

interface GameResult {
    winner: Player | null;
    moves: number;
    duration: number; // in milliseconds
    winCondition: 'way_of_stone' | 'way_of_stream' | null;
    difficultyPair: string; // e.g., "Easy vs Medium"
    startingPlayer: Player; // who started the game (based on side card)
}

interface SimulationResults {
    totalGames: number;
    results: GameResult[];
    byDifficulty: Record<string, {
        games: number;
        redWins: number;
        blueWins: number;
        draws: number;
        avgMoves: number;
        avgDuration: number;
        winByWayOfStone: number;
        winByWayofStream: number;
    }>;
}

const getDepthForDifficulty = (difficulty: Difficulty): number => {
    switch (difficulty) {
        case "Easy": return 1;
        case "Medium": return 3;
        case "Impossible": return 5;
        default: return 3;
    }
};

const playGame = (redDifficulty: Difficulty, blueDifficulty: Difficulty): GameResult => {
    const startTime = Date.now();
    let gameState = newGame(undefined, "Medium"); // Start with medium, but we'll override difficulties
    const startingPlayer = gameState.currentPlayer;
    let moves = 0;

    while (!gameState.winner && moves < 200) { // Prevent infinite loops
        const currentPlayer = gameState.currentPlayer;
        const difficulty = currentPlayer === 'red' ? redDifficulty : blueDifficulty;
        const depth = getDepthForDifficulty(difficulty);

        const bestMove = getBestMove(gameState, depth);
        if (!bestMove) break; // No moves available

        gameState = commitMove(gameState, bestMove);
        moves++;
    }

    const duration = Date.now() - startTime;

    return {
        winner: gameState.winner,
        moves,
        duration,
        winCondition: gameState.winCondition,
        difficultyPair: `${redDifficulty} vs ${blueDifficulty}`,
        startingPlayer: startingPlayer
    };
};

const runSimulation = (config: SimulationConfig): SimulationResults => {
    const results: GameResult[] = [];
    const byDifficulty: SimulationResults['byDifficulty'] = {};

    for (const pair of config.difficultyPairs) {
        const key = `${pair.red} vs ${pair.blue}`;

        if (!byDifficulty[key]) {
            byDifficulty[key] = {
                games: 0,
                redWins: 0,
                blueWins: 0,
                draws: 0,
                avgMoves: 0,
                avgDuration: 0,
                winByWayOfStone: 0,
                winByWayofStream: 0,
            };
        }

        console.log(`Running ${config.numGames} games: ${key}`);

        for (let i = 0; i < config.numGames; i++) {
            const result = playGame(pair.red, pair.blue);
            results.push(result);

            byDifficulty[key].games++;
            if (result.winner === 'red') {
                byDifficulty[key].redWins++;
            } else if (result.winner === 'blue') {
                byDifficulty[key].blueWins++;
            } else {
                byDifficulty[key].draws++;
            }

            if (result.winCondition === "way_of_stone") {
                byDifficulty[key].winByWayOfStone++;
            } else if (result.winCondition === "way_of_stream") {
                byDifficulty[key].winByWayofStream++;
            }

            byDifficulty[key].avgMoves = (byDifficulty[key].avgMoves * (byDifficulty[key].games - 1) + result.moves) / byDifficulty[key].games;
            byDifficulty[key].avgDuration = (byDifficulty[key].avgDuration * (byDifficulty[key].games - 1) + result.duration) / byDifficulty[key].games;

            if ((i + 1) % 10 === 0) {
                console.log(`  Completed ${i + 1}/${config.numGames} games`);
            }
        }
    }

    return {
        totalGames: results.length,
        results,
        byDifficulty
    };
};

const printResults = (results: SimulationResults) => {
    console.log('\n=== Simulation Results ===');
    console.log(`Total games played: ${results.totalGames}\n`);

    for (const [pair, stats] of Object.entries(results.byDifficulty)) {
        console.log(`Difficulty Pair: ${pair}`);
        console.log(`  Games: ${stats.games}`);
        console.log(`  Red wins: ${stats.redWins} (${((stats.redWins / stats.games) * 100).toFixed(1)}%)`);
        console.log(`  Blue wins: ${stats.blueWins} (${((stats.blueWins / stats.games) * 100).toFixed(1)}%)`);
        console.log(`  Draws: ${stats.draws} (${((stats.draws / stats.games) * 100).toFixed(1)}%)`);
        console.log(`  Average moves per game: ${stats.avgMoves.toFixed(1)}`);
        console.log(`  Average duration per game: ${stats.avgDuration.toFixed(0)}ms`);
        console.log(`  Win by way of stone: ${stats.winByWayOfStone}`);
        console.log(`  Win by way of stream: ${stats.winByWayofStream}`);
        console.log('');
    }
};

const resultsToCSV = (results: SimulationResults): string => {
    const headers = ['Difficulty Pair', 'Winner', 'Moves', 'Duration (ms)', 'Win Condition'];
    const csvRows = [headers.join(',')];

    for (const result of results.results) {
        const row = [
            `"${result.difficultyPair}"`,
            result.winner || 'Draw',
            result.moves.toString(),
            result.duration.toString(),
            result.winCondition || 'None'
        ];
        csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
};

// Command line argument parsing
const parseArgs = (): SimulationConfig => {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: npm run simulate [options]

Options:
  --games <number>          Number of games to play per difficulty pair (default: 50)
  --pair "<red> vs <blue>"   Difficulty pair to test (can be used multiple times)
                             Valid difficulties: Easy, Medium, Impossible

Examples:
  npm run simulate
  npm run simulate --games 100
  npm run simulate --games 20 --pair "Easy vs Medium" --pair "Medium vs Impossible"
  npm run simulate --help

Default pairs (if none specified):
  - Easy vs Easy
  - Easy vs Medium
  - Medium vs Medium
  - Medium vs Impossible
  - Impossible vs Impossible
`);
        process.exit(0);
    }

    const [numGamesArg = "50", ...pairs] = args
    const difficultyPairs: SimulationConfig['difficultyPairs'] = [];

    const parsePairArgLine = (str: string) => {
        const [red, blue] = str.split('vs').map(s => s.trim()) as [Difficulty, Difficulty];
        if (red && blue) {
            difficultyPairs.push({ red, blue });
        }
    }

    (pairs ?? []).forEach(parsePairArgLine)

    // Default pairs if none specified
    if (difficultyPairs.length === 0) {
        difficultyPairs.push(
            { red: "Easy", blue: "Easy" },
            { red: "Easy", blue: "Medium" },
            { red: "Medium", blue: "Medium" },
            { red: "Medium", blue: "Impossible" },
            { red: "Impossible", blue: "Impossible" }
        );
    }

    return { numGames: parseInt(numGamesArg, 10), difficultyPairs };
};

// Example usage
if (require.main === module) {
    const config = parseArgs();
    console.log(`Starting AI performance simulations with ${config.numGames} games per pair...`);
    console.log(`Difficulty pairs: ${config.difficultyPairs.map(p => `${p.red} vs ${p.blue}`).join(', ')}\n`);

    const results = runSimulation(config);
    printResults(results);

    // Optionally save to file
    const fs = require('fs');
    const outputFile = 'simulation-results.csv';
    const csvContent = resultsToCSV(results);
    fs.writeFileSync('dist/' + outputFile, csvContent);
    console.log(`\nResults saved to ${outputFile}`);
}

export { runSimulation };
export type { SimulationConfig, SimulationResults, GameResult };
