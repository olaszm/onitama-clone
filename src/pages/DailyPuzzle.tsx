import { useState, useEffect, useReducer, useCallback, useRef } from "react";
import GameBoard from "../components/GameBoard";
import PuzzleCompletionModal from "../components/PuzzleCompletionModal";
import { getOrCreateDailyPuzzle, loadPuzzleProgress, savePuzzleProgress, getNextMoveFromSolution, clearPuzzleCache, DailyPuzzle } from "../utils/puzzle";
import { newGame, reducer, commitMove } from "../reducers/originalReducer";
import { GameState, MovementCard, Piece, Player, Position, NotationMove } from "../types";
import { getValidMoves } from "../utils/cards";
import { Link } from "react-router-dom";

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function DailyPuzzlePage() {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const [state, dispatch] = useReducer(reducer, newGame(undefined, "Medium"));
    const [isGameOverModalOpen, setGameOverModalOpen] = useState(false);
    const [timer, setTimer] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [hint, setHint] = useState<NotationMove | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [uiState, setUIState] = useState({
        selectedPiece: null as Position | null,
        selectedCard: null as MovementCard | null,
        highlightedMoves: [] as Position[],
        hoveredPosition: null as Position | null,
        animatingMove: null as { from: Position; to: Position; progress: number } | null,
    });

    // Serialize game state for saving
    const serializeGameState = useCallback((gameState: GameState) => {
        return {
            boardEntries: Array.from(gameState.board.entries()),
            currentPlayer: gameState.currentPlayer,
            playerCards: gameState.playerCards,
            sideCard: gameState.sideCard,
            winner: gameState.winner,
            winCondition: gameState.winCondition,
            history: gameState.history,
        };
    }, []);

    // Restore game state from serialized data
    const restoreGameState = useCallback((savedState: any, basePuzzle: DailyPuzzle): GameState => {
        return {
            board: new Map(savedState.boardEntries),
            currentPlayer: savedState.currentPlayer,
            playerCards: savedState.playerCards,
            sideCard: savedState.sideCard,
            winner: savedState.winner,
            winCondition: savedState.winCondition,
            history: savedState.history,
            initialPlayerCards: basePuzzle.puzzleState.initialPlayerCards,
            difficulty: basePuzzle.puzzleState.difficulty,
        };
    }, []);

    useEffect(() => {
        try {
            const dailyPuzzle = getOrCreateDailyPuzzle();
            if (dailyPuzzle) {
                setPuzzle(dailyPuzzle);
                
                const progress = loadPuzzleProgress();
                if (progress) {
                    console.log("Restoring progress, completed:", progress.completed);
                    setTimer(progress.elapsedTime);
                    setHintsUsed(progress.hintsUsed);
                    setIsCompleted(progress.completed);

                    // Restore full game state from saved snapshot
                    const restoredState = restoreGameState(progress, dailyPuzzle);
                    dispatch({ type: "load_puzzle", puzzle: restoredState });
                } else {
                    // Start fresh from puzzle state
                    const freshState = {
                        ...dailyPuzzle.puzzleState,
                        board: new Map(dailyPuzzle.puzzleState.board),
                    };
                    dispatch({ type: "load_puzzle", puzzle: freshState });
                }
            }
        } catch (e) {
            console.error("Error loading daily puzzle:", e);
        }
        setIsLoading(false);
    }, [restoreGameState]);

    // Save progress on timer tick
    useEffect(() => {
        if (!isLoading && !isCompleted && puzzle) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    const newTime = prev + 1;
                    const progressData = {
                        date: puzzle.date,
                        elapsedTime: newTime,
                        completed: false,
                        hintsUsed,
                        ...serializeGameState(state),
                    };
                    savePuzzleProgress(progressData);
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isLoading, isCompleted, puzzle, hintsUsed, state, serializeGameState]);

    // Handle completion
    useEffect(() => {
        if (state.winner && puzzle && !isCompleted) {
            setIsCompleted(true);
            setGameOverModalOpen(true);
            const progressData = {
                date: puzzle.date,
                elapsedTime: timer,
                completed: true,
                hintsUsed,
                ...serializeGameState(state),
            };
            savePuzzleProgress(progressData);
        }
    }, [state.winner, puzzle, isCompleted, timer, hintsUsed, state, serializeGameState]);

    const convertNotationToAction = (notation: NotationMove, gameState: GameState) => {
        const from = {
            row: notation.from.rank - 1,
            col: notation.from.file.charCodeAt(0) - 97,
        };
        const to = {
            row: notation.to.rank - 1,
            col: notation.to.file.charCodeAt(0) - 97,
        };

        const playerCards = gameState.playerCards[gameState.currentPlayer];
        const cardUsed = playerCards.find((c) => c.name === notation.card);

        if (!cardUsed) return null;

        return {
            type: "move_piece" as const,
            from,
            to,
            cardUsed,
        };
    };

    const handlePieceSelect = useCallback(
        (pos: Position, piece: Piece | null) => {
            if (state.winner || isCompleted) return;

            const isHighlightedPos = uiState.highlightedMoves.some((p) => p.col === pos.col && p.row === pos.row);

            if (!isHighlightedPos) {
                if (piece && state.currentPlayer === piece.player) {
                    setUIState((prev) => ({ ...prev, selectedPiece: pos }));
                }
                return;
            }

            const { selectedPiece, selectedCard } = uiState;
            if (!selectedCard || !selectedPiece) return;

            dispatch({
                type: "move_piece",
                from: selectedPiece,
                to: pos,
                cardUsed: selectedCard,
                toHistory: true,
            });

            setUIState((prev) => ({ ...prev, selectedCard: null, selectedPiece: null, highlightedMoves: [] }));
            setShowHint(false);
            setHint(null);
        },
        [state, uiState, isCompleted]
    );

    const handleMovecardSelect = useCallback(
        (card: MovementCard, player: Player) => {
            if (state.winner || isCompleted) return;
            if (state.currentPlayer !== player) return;

            setUIState((prev) => ({ ...prev, selectedCard: card }));
        },
        [state, isCompleted]
    );

    useEffect(() => {
        const { selectedPiece, selectedCard } = uiState;
        if (selectedPiece && selectedCard) {
            const validMoves = getValidMoves(state.board, selectedPiece, selectedCard, state.currentPlayer);
            setUIState((prev) => ({ ...prev, highlightedMoves: validMoves }));
        }
    }, [uiState.selectedPiece, uiState.selectedCard, state.board, state.currentPlayer]);

    const handleShowHint = useCallback(() => {
        if (!puzzle || isCompleted) return;

        const nextMove = getNextMoveFromSolution(puzzle, state.history.length);
        if (nextMove) {
            setHint(nextMove);
            setShowHint(true);
            setHintsUsed((prev) => prev + 1);
        }
    }, [puzzle, state.history.length, isCompleted]);

    const resetPuzzle = useCallback(() => {
        if (!puzzle) return;

        const freshState = {
            ...puzzle.puzzleState,
            board: new Map(puzzle.puzzleState.board),
        };
        dispatch({ type: "load_puzzle", puzzle: freshState });
        
        setUIState({
            selectedPiece: null,
            selectedCard: null,
            highlightedMoves: [],
            hoveredPosition: null,
            animatingMove: null,
        });
        setTimer(0);
        setHintsUsed(0);
        setIsCompleted(false);
        setShowHint(false);
        setHint(null);
        setGameOverModalOpen(false);

        savePuzzleProgress({
            date: puzzle.date,
            elapsedTime: 0,
            completed: false,
            hintsUsed: 0,
            boardEntries: Array.from(puzzle.puzzleState.board.entries()),
            currentPlayer: puzzle.puzzleState.currentPlayer,
            playerCards: puzzle.puzzleState.playerCards as { red: readonly [MovementCard, MovementCard]; blue: readonly [MovementCard, MovementCard] },
            sideCard: puzzle.puzzleState.sideCard,
            winner: null,
            winCondition: null,
            history: [],
        });
    }, [puzzle]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="text-white text-xl">Loading daily puzzle...</div>
            </div>
        );
    }

    if (!puzzle) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="text-white text-xl mb-4">Failed to load daily puzzle</div>
                <Link to="/" className="text-blue-400 hover:text-blue-300">
                    Return to menu
                </Link>
            </div>
        );
    }

    const movesRemaining = puzzle.solution.length - state.history.length;

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex flex-row justify-between items-center my-2 shrink-0 px-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-white hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <span className="text-white font-bold">Daily Puzzle</span>
                    <span className="text-gray-400 text-sm">{puzzle.date}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800 px-3 py-1 rounded-full text-white text-sm">Time: {formatTime(timer)}</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${state.currentPlayer === "red" ? "bg-[#D98BA1] text-white" : "bg-[#1565C0] text-white"}`}>
                        {state.currentPlayer === puzzle.currentPlayer ? "Your Turn" : "Opponent's Turn"}
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-between items-center mb-2 shrink-0 px-4">
                <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm">Moves remaining: {movesRemaining}</span>
                    <span className="text-gray-300 text-sm">Hints used: {hintsUsed}</span>
                </div>
                <button
                    onClick={handleShowHint}
                    disabled={isCompleted || showHint}
                    className={`px-4 py-1 rounded text-sm transition-colors ${
                        isCompleted || showHint ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-500 text-white"
                    }`}
                >
                    {showHint ? "Hint Shown" : "Get Hint"}
                </button>
            </div>

            {showHint && hint && (
                <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg mx-4 mb-2 p-3 shrink-0">
                    <div className="text-yellow-200 text-sm">
                        <span className="font-bold">Hint:</span> Move your {hint.piece === "M" ? "Master" : "Student"} from {hint.from.file}
                        {hint.from.rank} to {hint.to.file}
                        {hint.to.rank} using the {hint.card} card
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                <GameBoard
                    onPieceSelect={handlePieceSelect}
                    onMoveCardSelect={handleMovecardSelect}
                    state={state}
                    dispatcher={dispatch}
                    reducer={reducer}
                    uiState={uiState}
                    isInteractionsBlocked={isCompleted}
                    historyIndex={null}
                    onHistoryNavigate={() => {}}
                    showHistoryNavigation={false}
                />
            </div>

            <PuzzleCompletionModal
                isOpen={isGameOverModalOpen}
                time={timer}
                hintsUsed={hintsUsed}
                winCondition={state.winCondition}
                onClose={() => setGameOverModalOpen(false)}
                onPlayAgain={resetPuzzle}
            />
        </div>
    );
}

export default DailyPuzzlePage;
