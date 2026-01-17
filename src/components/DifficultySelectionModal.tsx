import { Difficulty } from "../types";

function DifficultySelectionModal({
    isOpen,
    handleDifficultySelect,
}: {
    isOpen: boolean;
    handleDifficultySelect: (difficulty: Difficulty) => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#131C26] text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
                <div className="flex flex-col gap-2 min-w-[300px] py-2">
                    <button
                        className="px-4 py-3 text-lg border border-white text-white rounded hover:bg-white hover:text-[#131C26] transition-colors"
                        onClick={() => handleDifficultySelect("Easy")}
                    >
                        Easy
                    </button>
                    <button
                        className="px-4 py-3 text-lg border border-white text-white rounded hover:bg-white hover:text-[#131C26] transition-colors"
                        onClick={() => handleDifficultySelect("Medium")}
                    >
                        Medium
                    </button>
                    <button
                        className="px-4 py-3 text-lg border border-white text-white rounded hover:bg-white hover:text-[#131C26] transition-colors"
                        onClick={() => handleDifficultySelect("Impossible")}
                    >
                        Impossible
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DifficultySelectionModal;
