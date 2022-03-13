import React from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

function MenuItems() {
	return (
		<Container maxWidth="sm">
			<Stack spacing={2}>
				<Link to="/play">
					<Button style={{ width: "100%" }} variant="contained">
						{" "}
						Start{" "}
					</Button>
				</Link>
				<Link to="/how-to">
					<Button style={{ width: "100%" }} variant="contained">
						{" "}
						How to play{" "}
					</Button>
				</Link>
			</Stack>
		</Container>
	);
}

export default MenuItems;
