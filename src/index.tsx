import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import StartMenu from "./pages/StartMenu";
import AboutPage from "./pages/AboutPage";
import GamePage from "./pages/GamePage";
import Tutorials from "./pages/Tutorials";
import CardLibrary from "./pages/CardLibrary";
import Footer from "./components/Footer";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="px-4">
                <div className="min-h-dvh">
                    <Routes>
                        <Route path="/" element={<StartMenu />} />
                        <Route path="/play" element={<GamePage />} />
                        <Route path="/tutorials" element={<Tutorials />} />
                        <Route path="/library" element={<CardLibrary />} />
                        <Route path="/how-to" element={<AboutPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

