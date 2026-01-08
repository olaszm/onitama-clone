import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Difficulty } from "../types";

function DifficultySelectionModal({
    isOpen,
    handleDifficultySelect,
}: {
    isOpen: boolean;
    handleDifficultySelect: (difficulty: Difficulty) => void;
}) {
    return (
        <Dialog open={isOpen}>
            <DialogTitle>Select Difficulty</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ minWidth: "300px", py: 2 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => handleDifficultySelect("Easy")}
                    >
                        Easy
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => handleDifficultySelect("Medium")}
                    >
                        Medium
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => handleDifficultySelect("Impossible")}
                    >
                        Impossible
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default DifficultySelectionModal;
