import React from "react";

function SettingsModal({
	isOpen,
    handleClose,
	children,
}: {
	isOpen: boolean;
    handleClose: () => void;
	children: any;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-[#131C26] text-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
				<h2 className="text-2xl font-bold mb-4">Settings</h2>
				<div>
					{children}
				</div>
			</div>
		</div>
	);
}

export default SettingsModal;
