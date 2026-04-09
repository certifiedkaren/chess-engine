import { useState, useRef } from "react";
import "./App.css";
import { Chess, type Square } from "chess.js";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";
/* 
example pgn
1. d4 d5 2. Bf4 e6 3. e3 h6 4. Nf3 Nf6 5. Bd3 Bb4+ 6. c3 Bd6 7. Bg3 O-O 8. Nbd2
Nc6 9. Ne5 Nh7 10. Nxc6 bxc6 11. Qc2 f5 12. Bxd6 cxd6 13. O-O Qf6 14. Nf3 Bd7
15. b3 Ng5 16. Nxg5 Qxg5 17. c4 dxc4 18. bxc4 Rac8 19. Rab1 d5 20. a4 dxc4 21.
Bxc4 Qe7 22. Rb7 Qd6 23. Rxa7 Rf7 24. a5 c5 25. dxc5 Qxc5 26. Rc1 Qxa7 27. a6
Rff8 28. Qd3 Rfd8 29. Rb1 Ba4 30. Qa3 Bc2 31. Bxe6+ Kh8 32. Rc1 Rc7 33. g3 Be4
34. h3 Rxc1+ 35. Qxc1 Qxa6 36. Bf7 Qb7 37. Ba2 Rc8 38. Qd2 Qc6 39. Kh2 Qc1 40.
Qe2 Qh1# 0-1

O-O - castle kingside
O-O-O - queenside castle
add check-valid pgn function
*/

function App() {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  function filterPgn(pgn: string): string[] {
    return pgn
      .replace(/\d+\./g, "")
      .replace(/1-0|0-1|1\/2-1\/2/g, "")
      .trim()
      .split(/\s+/);
  }

  function loadPgn(pgn: string[]): {
    whiteArr: string[];
    blackArr: string[];
  } {
    let whiteArr = pgn.filter((_, i) => i % 2 == 0);
    let blackArr = pgn.filter((_, i) => i % 2 == 1);
    return { whiteArr, blackArr };
  }

  function gameOver(): string | void {
    if (chessGame.isStalemate()) {
      return "draw: stalemate";
    }
    if (chessGame.isThreefoldRepetition()) {
      return "draw: repetition";
    }
    if (chessGame.isGameOver()) {
      // TODO: add who won, I would assume you track who made the last move
      // then that person would be th winner
      return "game over";
    }
  }

  function getMoveOptions(square: Square) {
    const moves = chessGame.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};

    for (const move of moves) {
      newSquares[move.to] = {
        background:
          chessGame.get(move.to) &&
          chessGame.get(move.to)?.color !== chessGame.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);

    return true;
  }

  function onSquareClick({ square, piece }: SquareHandlerArgs) {
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }

    const moves = chessGame.moves({
      square: moveFrom as Square,
      verbose: true,
    });

    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square as Square);
      setMoveFrom(hasMoveOptions ? square : "");
      return;
    }

    try {
      chessGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
    } catch {
      const hasMoveOptions = getMoveOptions(square as Square);
      if (hasMoveOptions) {
        setMoveFrom(square);
      }
      return;
    }

    setChessPosition(chessGame.fen());

    setMoveFrom("");
    setOptionSquares({});
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) {
      return false;
    }

    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare as string,
        promotion: "q",
      });

      setChessPosition(chessGame.fen());
      setMoveFrom("");
      setOptionSquares({});
      return true;
    } catch {
      return false;
    }
  }

  const chessboardOptions = {
    onPieceDrop,
    onSquareClick,
    position: chessPosition,
    squareStyles: optionSquares,
    id: "click-or-drag-to-move",
  };

  const result = gameOver();

  return (
    <div className="container">
      <div className="box1">
        {typeof result == "string" && <h1>{result}</h1>}
      </div>
      <div className="box2">
        <Chessboard options={chessboardOptions} />
      </div>
    </div>
  );
}

export default App;
