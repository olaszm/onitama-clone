import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/AboutPage/Section";
import useScrollProgress from "../hooks/useScrollProgress";

function AboutPage() {
	const { scrollProgress, isScrollable } = useScrollProgress();

	return (
		<>
			{!!isScrollable && (
				<div
					className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50"
					style={{
						backgroundColor: '#e5e7eb',
					}}
				>
					<div
						className="h-full bg-[#1565C0]"
						style={{
							width: `${scrollProgress}%`,
						}}
					></div>
				</div>
			)}

			<div>
				<div className="flex flex-col gap-4">
					<Section title="What is it">
						Onitama is a strategy board game for two players created
						in 2014 by Japanese game designer Shimpei Sato and
						launched by Arcane Wonders. In Germany, the game was
						launched by Pegasus Games in 2017. It is thematically
						based on the different fighting styles of Japanese
						martial arts. The game had a digital release in 2018.{" "}
						<a
							href="https://en.wikipedia.org/wiki/Onitama"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#1565C0] hover:underline"
						>
							Read More
						</a>
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
						<h6 className="text-lg font-semibold">
							There are two separate methods to win a game:
						</h6>
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
						<hr className="my-4 border-gray-600" />
						<ul className="list-disc list-inside">
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
				</div>

				<Link to="/">
					<button className="bg-[#1565C0] text-white px-4 py-2 rounded hover:bg-[#0d47a1] transition-colors">
						Back
					</button>
				</Link>
			</div>
		</>
	);
}

export default AboutPage;
