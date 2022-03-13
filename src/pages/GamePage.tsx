import React from "react";
import Container from "@mui/material/Container";
import GameBoard from "../components/GameBoard";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function GamePage() {
	return (
		<Container>
			<div>
				<Link to='/'>
					<Button variant='contained'>End Game</Button>
				</Link>
			</div>
			<GameBoard></GameBoard>
		</Container>
	);
}

export default GamePage;
