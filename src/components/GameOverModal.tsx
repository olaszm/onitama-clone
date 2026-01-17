import { Player, WinCondition } from "../types";

function GameOverModal({
    isOpen,
    winner,
    winCondition,
    handleClose,
}: {
    isOpen: boolean;
    winner: Player;
    winCondition: WinCondition
    handleClose: (reason: "close" | "new") => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#131C26] text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Game Over!🎉</h2>
                <p className="mb-6">
                    {winner} won the game by the {winCondition}! Do you want to try again?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleClose("close")}
                        className="px-4 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-[#131C26] transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleClose("new")}
                        className="px-4 py-2 bg-[#1565C0] text-white rounded hover:bg-[#0d47a1] transition-colors"
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameOverModal;
