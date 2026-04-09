import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./ChessboardPanel.css";
import ChessboardPanel from "./ChessboardPanel.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChessboardPanel />
  </StrictMode>,
);
