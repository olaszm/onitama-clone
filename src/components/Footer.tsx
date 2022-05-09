import { Stack, Link as MUILink } from "@mui/material";
import React from "react";
import { ReactComponent as Logo } from "../assets/emblem_white.svg";

function Footer() {
	return (
		<Stack
			sx={{ mt: 5, mb: 2 }}
			direction="row"
			justifyContent="space-between"
			alignItems="center"
		>
			<div>
				<Logo style={{ height: "30px" }} />
			</div>

			<Stack
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
				spacing={2}
			>
				<MUILink
					href="https://github.com/olaszm/onimata"
					target="_blank"
					rel="noopener noreferrer"
				>
					Repo
				</MUILink>
				<MUILink
					target="_blank"
					href="https://martinolasz.dev"
					rel="noopener noreferrer"
				>
					Portfolio
				</MUILink>
			</Stack>
		</Stack>
	);
}

export default Footer;
