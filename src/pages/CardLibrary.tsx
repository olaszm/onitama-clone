import { Button, Container, Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import MovementCardDisplay from "../components/MoveCardElement";
import { ALL_CARDS } from "../utils/cards";

function CardLibrary() {


    return (
        <Container>
            <h1 style={{ textAlign: "center" }}>Card Library</h1>
            <Stack direction="column" spacing={2} >
                <Link to="/">
                    <Button variant="contained">Back</Button>
                </Link>
                <Grid container spacing={2} >
                    {ALL_CARDS.map(card => {
                        return (
                            <Grid item xs={6} md={3}>
                                <MovementCardDisplay card={card} isSelected={false} isMuted={false} currentPlayer='red'></MovementCardDisplay>
                            </Grid>
                        )
                    })}
                </Grid>
            </Stack>
        </Container>
    );
}

export default CardLibrary;
