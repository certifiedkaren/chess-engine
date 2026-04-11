import { useState, useRef, useEffect } from "react";
import ChessboardPanel from "./ChessboardPanel";
import { Chess } from "chess.js";
import Sidebar from "./Sidebar";
import "./App.css";

const App = () => {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [mainlineMoves, setMainlineMoves] = useState<string[]>([]);
  const [mainlineFens, setMainlineFens] = useState<string[]>([
    new Chess().fen(),
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState("");
  const [isOnMainLine, setIsOnMainLine] = useState(true);
  const [pgn, setPgn] = useState("");

  (useEffect(() => {
    function handleKeypress(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMove();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMove();
      }
    }
    window.addEventListener("keydown", handleKeypress);

    return () => {
      window.removeEventListener("keydown", handleKeypress);
    };
  }),
    [nextMove, prevMove, mainlineFens.length]);

  function gotoBeginning() {
    setCurrentIndex(0);
  }

  function gotoEnd() {
    setCurrentIndex(mainlineFens.length - 1);
  }

  function nextMove() {
    if (currentIndex < mainlineMoves.length) {
      setCurrentIndex((i) => i + 1);
      setCurrentFen(chessGame.fen());
    }
  }

  function prevMove() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCurrentFen(chessGame.fen());
    }
  }

  function importPgn(pgn: string) {
    const temp = new Chess();
    try {
      temp.loadPgn(pgn);
    } catch {
      console.log("invalid pgn");
      return;
    }

    const history = temp.history();
    const replay = new Chess();
    const fens: string[] = [replay.fen()];

    for (const move of history) {
      replay.move(move);
      fens.push(replay.fen());
    }

    setMainlineMoves(history);
    setMainlineFens(fens);
    setCurrentIndex(0);
  }

  function handleUserMove(from: string, to: string): boolean {
    const game = new Chess(currentFen);
    try {
      game.move({ from, to, promotion: "q" });
    } catch {
      console.log("invalid move");
      return false;
    }

    setCurrentFen(game.fen());
    setIsOnMainLine(false);
    return true;
  }

  return (
    <div className="container">
      <ChessboardPanel
        fen={mainlineFens[currentIndex]}
        onUserMove={handleUserMove}
      />
      <Sidebar
        pgn={pgn}
        setPgn={setPgn}
        onNextMove={nextMove}
        onPrevMove={prevMove}
        onImportPgn={importPgn}
        onBeginning={gotoBeginning}
        onEnd={gotoEnd}
        mainlineMoves={mainlineMoves}
      />
    </div>
  );
};

export default App;
