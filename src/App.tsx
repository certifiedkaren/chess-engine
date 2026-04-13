import { useState, useEffect } from "react";
import ChessboardPanel from "./ChessboardPanel";
import { Chess } from "chess.js";
import Sidebar from "./Sidebar";
import "./App.css";

const App = () => {
  const [mainlineMoves, setMainlineMoves] = useState<string[]>([]);
  const [mainlineFens, setMainlineFens] = useState<string[]>([
    new Chess().fen(),
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [branchStartIndex, setBranchStartIndex] = useState<number | null>(null);
  const [currentFen, setCurrentFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
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
    setCurrentFen(mainlineFens[0]);
    setIsOnMainLine(true);
  }

  function gotoEnd() {
    const lastIndex = mainlineFens.length - 1;
    setCurrentIndex(lastIndex);
    setCurrentFen(mainlineFens[lastIndex]);
    setIsOnMainLine(true);
  }

  function gotoMove(move: number) {
    if (move < mainlineMoves.length) {
      setCurrentIndex(move);
      setCurrentFen(mainlineFens[move]);
      setIsOnMainLine(true);
    }
  }

  function nextMove() {
    if (currentIndex < mainlineMoves.length) {
      setCurrentIndex((i) => i + 1);
      setCurrentFen(mainlineFens[currentIndex + 1]);
      setIsOnMainLine(true);
    }
  }

  function prevMove() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCurrentFen(mainlineFens[currentIndex - 1]);
      setIsOnMainLine(true);
    }
  }

  function returnToMainline() {
    if (branchStartIndex !== null) {
      setCurrentFen(mainlineFens[branchStartIndex]);
      setBranchStartIndex(null);
      setIsOnMainLine(true);
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
      if (isOnMainLine) {
        setBranchStartIndex(currentIndex);
      }
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
      <ChessboardPanel fen={currentFen} onUserMove={handleUserMove} />

      <Sidebar
        pgnState={{
          pgn,
          setPgn,
        }}
        navigation={{
          onNextMove: nextMove,
          onPrevMove: prevMove,
          gotoMove,
          onBeginning: gotoBeginning,
          onEnd: gotoEnd,
          returnToMainline: returnToMainline,
        }}
        gameState={{
          mainlineMoves,
          currentIndex,
          branchStartIndex,
        }}
        actions={{
          onImportPgn: importPgn,
        }}
      />
    </div>
  );
};

export default App;
