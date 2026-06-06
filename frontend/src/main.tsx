import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./app/App.tsx";
import SavedGames from "./saved-games/SavedGames.tsx";
import Navbar from "./navbar/Navbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/analyze/:gameId" element={<App />} />
        <Route path="/saved-games" element={<SavedGames />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
