import { useState, useEffect } from "react";
import ChessboardPanel from "./ChessboardPanel";
import { Chess } from "chess.js";
import Sidebar from "./Sidebar";
import Analyze from "./Analyze";
import { analyzePosition } from "./api";
import "./App.css";

const App = () => {
  const [mainlineMoves, setMainlineMoves] = useState<string[]>([]);
  const [mainlineFens, setMainlineFens] = useState<string[]>([
    new Chess().fen(),
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [branchStartIndex, setBranchStartIndex] = useState<number | null>(null);
  const [currentBranchIndex, setCurrentBranchIndex] = useState<number | null>(
    null,
  );
  const [branchFens, setBranchFens] = useState<string[]>([]);
  const [currentFen, setCurrentFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [isOnMainLine, setIsOnMainLine] = useState(true);
  const [pgn, setPgn] = useState("");
  const [bestMoves, setBestMoves] = useState<string[]>([]);
  const [bestMovesArr, setBestMovesArr] = useState<string[][]>([]);

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

    if (!isOnMainLine) {
      setBranchStartIndex(null);
      setCurrentBranchIndex(null);
      setBranchFens([]);
    }
    setIsOnMainLine(true);
  }

  function gotoEnd() {
    const lastIndex = mainlineFens.length - 1;
    setCurrentIndex(lastIndex);
    setCurrentFen(mainlineFens[lastIndex]);

    if (!isOnMainLine) {
      setBranchStartIndex(null);
      setCurrentBranchIndex(null);
      setBranchFens([]);
    }
    setIsOnMainLine(true);
  }

  function gotoMove(move: number) {
    if (isOnMainLine) {
      if (move >= 0 && move < mainlineFens.length) {
        setCurrentIndex(move);
        setCurrentFen(mainlineFens[move]);
      }
    } else {
      if (move >= 0 && move < branchFens.length) {
        setCurrentBranchIndex(move);
        setCurrentFen(branchFens[move]);
      }
    }
  }

  function nextMove() {
    if (isOnMainLine) {
      if (currentIndex < mainlineMoves.length) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentFen(mainlineFens[nextIndex]);
      }
    } else {
      if (currentBranchIndex === null) return;

      if (currentBranchIndex < branchFens.length) {
        const nextIndex = currentBranchIndex + 1;
        setCurrentBranchIndex(nextIndex);
        setCurrentFen(branchFens[nextIndex]);
      }
    }
  }

  function prevMove() {
    if (isOnMainLine) {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        setCurrentFen(mainlineFens[prevIndex]);
      }
    } else {
      if (currentBranchIndex === null) return;

      if (currentBranchIndex > 0) {
        const prevIndex = currentBranchIndex - 1;
        setCurrentBranchIndex(prevIndex);
        setCurrentFen(branchFens[prevIndex]);
      } else if (branchStartIndex !== null) {
        setIsOnMainLine(true);
        setCurrentIndex(branchStartIndex);
        setCurrentFen(mainlineFens[branchStartIndex]);
        setCurrentBranchIndex(null);
      }
    }
  }

  function returnToMainline() {
    if (branchStartIndex !== null) {
      setCurrentFen(mainlineFens[branchStartIndex]);
      setBranchStartIndex(null);
      setCurrentBranchIndex(null);
      setBranchFens([]);
      setIsOnMainLine(true);
    }
  }

  async function importPgn(pgn: string) {
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

    const tempBestMoves: string[][] = [];

    const tempBestMove = await analyzeFen(replay.fen());
    if (tempBestMove !== undefined) {
      tempBestMoves.push(tempBestMove);
    }

    for (const move of history) {
      replay.move(move);
      fens.push(replay.fen());
      const tempBestMove = await analyzeFen(replay.fen());
      if (tempBestMove !== undefined) {
        tempBestMoves.push(tempBestMove);
      }
    }

    setBestMovesArr(tempBestMoves);

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
        setBranchFens([currentFen, game.fen()]);
        setCurrentBranchIndex(1);
      } else {
        if (currentBranchIndex === null) {
          setCurrentBranchIndex(1);
          return false;
        }

        setBranchFens((prev) => [
          ...prev.slice(0, currentBranchIndex + 1),
          game.fen(),
        ]);

        setCurrentBranchIndex((i) => (i === null ? 1 : i + 1));
      }
    } catch {
      console.log("invalid move");
      return false;
    }

    setCurrentFen(game.fen());
    setIsOnMainLine(false);
    return true;
  }

  async function analyzeFen(fen: string): Promise<string[] | undefined> {
    try {
      const response = (await analyzePosition(fen)).best_moves.map(
        (move) => move.san,
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAnalyze(): Promise<void> {
    try {
      const response = await analyzePosition(currentFen);
      setBestMoves(response.best_moves.map((move) => move.san));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      <ChessboardPanel fen={currentFen} onUserMove={handleUserMove} />
      <div>
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
            mainlineMoves: mainlineMoves,
            currentIndex: currentIndex,
            onMainLine: isOnMainLine,
          }}
          actions={{
            onImportPgn: importPgn,
          }}
        />
        <Analyze
          bestMoves={bestMovesArr}
          currentIndex={currentIndex}
          onAnalyze={handleAnalyze}
        />
      </div>
    </div>
  );
};

export default App;
