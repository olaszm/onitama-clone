import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
    return (
        <Dialog open={isOpen}>
            <DialogTitle>Game Over!🎉</DialogTitle>
            <DialogContent>
                {winner} won the game by the {winCondition}! Do you want to try again?
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose("close")}>Close</Button>
                <Button onClick={() => handleClose("new")} autoFocus>
                    New Game
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default GameOverModal;
