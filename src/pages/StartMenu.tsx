import React from "react";
import Container from "@mui/material/Container";
import MenuItems from "../components/StartMenu/MenuItems";

function StartMenu() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Onimata</h1>
      <MenuItems />
    </div>
  );
}

export default StartMenu;
