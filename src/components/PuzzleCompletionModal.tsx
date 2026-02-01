import { WinCondition } from "../types";

interface PuzzleCompletionModalProps {
    isOpen: boolean;
    time: number;
    hintsUsed: number;
    winCondition: WinCondition;
    onClose: () => void;
    onPlayAgain: () => void;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function PuzzleCompletionModal({ isOpen, time, hintsUsed, winCondition, onClose, onPlayAgain }: PuzzleCompletionModalProps) {
    if (!isOpen) return null;

    const winMessage = winCondition === "way_of_stone" 
        ? "Way of the Stone!" 
        : "Way of the Stream!";

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
                <h2 className="text-2xl font-bold text-center text-white mb-4">
                    Daily Puzzle Complete!
                </h2>
                
                <div className="text-center mb-6">
                    <div className="text-green-400 text-lg font-semibold mb-2">
                        {winMessage}
                    </div>
                    <p className="text-gray-300">
                        Congratulations! You solved today&apos;s puzzle.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Time</div>
                        <div className="text-white text-xl font-bold">{formatTime(time)}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-gray-400 text-sm">Hints Used</div>
                        <div className="text-white text-xl font-bold">{hintsUsed}</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onPlayAgain}
                        className="flex-1 bg-[#1565C0] text-white px-4 py-2 rounded hover:bg-[#0d47a1] transition-colors"
                    >
                        Try Again
                    </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-4">
                    Come back tomorrow for a new puzzle!
                </p>
            </div>
        </div>
    );
}

export default PuzzleCompletionModal;
