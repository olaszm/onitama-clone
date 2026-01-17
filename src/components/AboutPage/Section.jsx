import React from "react";

function Section({ title, children }) {
	return (
		<div className="flex flex-col gap-2">
			<h5 className="text-xl font-semibold">{title}</h5>
			<div>
				{children}
			</div>
		</div>
	);
}

export default Section;
