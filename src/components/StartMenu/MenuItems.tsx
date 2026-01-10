import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

type MenuItem = {
    label: string,
    path: string
}

function renderMenuItem(item: MenuItem) {
    return (
        <Link to={item.path} key={item.path}>
            <Button style={{ width: "100%" }} variant="contained">
                {item.label}
            </Button>
        </Link>

    )
}

function MenuItems() {
    const menuItems: MenuItem[] = [
        { label: "Start", path: "/play" },
        // { label: "Tutorial", path: "/tutorials" },
        { label: "How to play", path: "/how-to" },
        { label: "Card Library", path: "/library" }
    ]


    return (
        <Container maxWidth="sm">
            <Stack spacing={2}>
                {menuItems.map(renderMenuItem)}
            </Stack>
        </Container>
    );
}

export default MenuItems;
