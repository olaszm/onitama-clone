import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

function GameOverModal({
	isOpen,
	handleClose,
}: {
	isOpen: boolean;
	handleClose: () => void;
}) {
	return (
		<Dialog open={isOpen}>
			<DialogTitle>Game Over!🎉</DialogTitle>
            <DialogContent>
                XY won the game! Do you want to try again?
            </DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Close</Button>
				<Button onClick={handleClose} autoFocus>
					New Game
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default GameOverModal;
