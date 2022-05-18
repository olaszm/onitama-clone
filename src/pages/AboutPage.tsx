import React from "react";
import {
	Button,
	Divider,
	LinearProgress,
	Link as MUILink,
	Stack,
	Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Section from "../components/AboutPage/Section";
import useScrollProgress from "../hooks/useScrollProgress";

function AboutPage() {
	const { scrollProgress, isScrollable } = useScrollProgress();

	return (
		<>
			{!!isScrollable && (
				<LinearProgress
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 1000,
					}}
					variant="determinate"
					value={scrollProgress}
				/>
			)}

			<div >
				<Stack spacing={2}>
					<Section title="What is it">
						Onitama is a strategy board game for two players created
						in 2014 by Japanese game designer Shimpei Sato and
						launched by Arcane Wonders. In Germany, the game was
						launched by Pegasus Games in 2017. It is thematically
						based on the different fighting styles of Japanese
						martial arts. The game had a digital release in 2018.{" "}
						<MUILink
							href="https://en.wikipedia.org/wiki/Onitama"
							target="_blank"
							rel="noopener noreferrer"
						>
							Read More
						</MUILink>
					</Section>

					<Section title="The setup">
						The game is played on a 5x5 board. Each player receives
						five pieces, one master piece placed in the middle
						square of the back row, known as the Shrine, and four
						pieces flanking the master, known as pupils. Sixteen
						movement cards dictate the movement of the pieces during
						the game. Five of the 16 movement cards are utilized per
						game.
					</Section>

					<Section title="Game Play">
						<Typography variant="h6">
							There are two separate methods to win a game:
						</Typography>
						<p>
							The first method, known as the Way of the Stone,
							requires the player to capture the opponents master
							piece.
						</p>
						<p>
							The second method, known as the Way of the Stream,
							requires the player to move their master piece into
							the opponent's Shrine.
						</p>
						<Divider />
						<ul>
							<li key="0">
								Players shuffle the 16 movement cards and then
								give two movement cards to each player and one
								movement card is placed on the side of the board
								for a total of 5 movement cards in play.
							</li>
							<li key="1">
								Each piece can be captured, and captures other
								pieces, the same way which is based on the
								movement provided by the movement cards.
							</li>
							<li key="2">
								After one player moves they must replace the
								movement card at the side with the used movement
								card, allowing both players rotating access to
								all 5 movement cards in play.
							</li>
						</ul>
					</Section>
				</Stack>

				<Link to="/">
					<Button variant="contained">Back</Button>
				</Link>
			</div>
		</>
	);
}

export default AboutPage;
