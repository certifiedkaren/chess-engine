import { useState, useRef } from "react";
import styles from "./ChessboardPanel.module.css";
import { Chess, type Square } from "chess.js";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type SquareHandlerArgs,
} from "react-chessboard";

interface Props {
  fen: string;
  onUserMove: (from: string, to: string) => boolean;
}

function ChessboardPanel({ fen, onUserMove }: Props) {
  const chessGame = new Chess(fen);
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

  function gameOver(): string | void {
    if (chessGame.isStalemate()) {
      return "draw: stalemate";
    }
    if (chessGame.isThreefoldRepetition()) {
      return "draw: repetition";
    }
    if (chessGame.isGameOver()) {
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

    const didMove = onUserMove(moveFrom, square);
    if (didMove) {
      setMoveFrom("");
      setOptionSquares({});
      return;
    }
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) {
      return false;
    }
    const didMove = onUserMove(sourceSquare, targetSquare);
    if (didMove) {
      setMoveFrom("");
      setOptionSquares({});
      return true;
    }
    return false;
  }

  const chessboardOptions = {
    onPieceDrop,
    onSquareClick,
    position: fen,
    squareStyles: optionSquares,
    id: "click-or-drag-to-move",
  };

  const result = gameOver();

  return (
    <div className={styles.chessboardContainer}>
      <div className="box1">
        {typeof result == "string" && <h1>{result}</h1>}
      </div>
      <div className="box2">
        <Chessboard options={chessboardOptions} />
      </div>
    </div>
  );
}

export default ChessboardPanel;
