import React from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@mui/material";

function SettingsModal({
	isOpen,
    handleClose,
	children,
}: {
	isOpen: boolean;
    handleClose: () => void;
	children: any;
}) {
	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>Settings</DialogTitle>
			<DialogContent>
                {children}
			</DialogContent>
		</Dialog>
	);
}

export default SettingsModal;
