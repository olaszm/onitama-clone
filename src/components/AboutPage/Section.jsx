import React from "react";
import { Stack, Typography } from "@mui/material";

function Section({ title, children }) {
	return (
		<Stack spacing={2}>
			<Typography variant="h5">{title}</Typography>
			<Typography variant="body1" component="div">
				{children}
			</Typography>
		</Stack>
	);
}

export default Section;
