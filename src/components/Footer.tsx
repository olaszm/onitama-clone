import { Stack, Link as MUILink } from "@mui/material";
import React from "react";
import { ReactComponent as Logo } from "../assets/emblem_white.svg";

function Footer() {
	const getCurrentYear = ():string => {
		const date = new Date()
		return date.getFullYear().toString()
	}

	return (
		<Stack
			sx={{ mt: 5, mb: 2 }}
			direction="row"
			justifyContent="space-between"
			alignItems="center"
		>
			<Stack	
				direction='row'
				justifyContent="space-evenly"
				alignItems="center"
				spacing={2}
			>
				<Logo style={{ height: "30px" }} />
				<small>
					All rights reserved &copy; {getCurrentYear()}
				</small>			
			</Stack>

			<Stack
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
				spacing={2}
			>
				<MUILink
					href="https://github.com/olaszm/onitama-clone"
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
