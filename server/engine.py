import os
from dotenv import load_dotenv
from stockfish import Stockfish
import chess

load_dotenv()

stockfish_path = os.getenv("STOCKFISH_PATH")
if stockfish_path is None:
    raise ValueError("stockfish path is not set")

stockfish = Stockfish(
    path=stockfish_path,
    parameters={
        "Threads": 4,
        "Hash": 256,
    }
)


def get_best_moves(fen: str, depth: int, num_results: int = 3):
    if (not stockfish.is_fen_valid(fen)):
        raise ValueError("fen is not valid")

    board = chess.Board(fen)
    if board.is_game_over():
        return []

    stockfish.set_fen_position(fen)
    stockfish.set_depth(depth)
    uci_top_moves = stockfish.get_top_moves(num_results)

    result = []

    for move_info in uci_top_moves:
        move = move_info["Move"]
        if not isinstance(move, str):
            continue

        try:
            uci_move = chess.Move.from_uci(move)
            if not board.is_legal(uci_move):
                continue

            result.append({
                "uci": move,
                "san": board.san(uci_move),
                "centipawn": move_info["Centipawn"],
                "mate": move_info["Mate"]
            })
        except Exception as e:
            print(f"failed to parse move {move} in fen {fen}: {e}")
    return result


def evaluate_position(fen: str, depth: int):
    if (not stockfish.is_fen_valid(fen)):
        raise ValueError("fen is not valid")
    stockfish.set_fen_position(fen)
    stockfish.set_depth(depth)
    evaluation = stockfish.get_evaluation()

    side_to_move = fen.split()[1]
    value = int(evaluation["value"])
    if side_to_move == "b":
        value = -value

    evaluation["value"] = value
    return evaluation
