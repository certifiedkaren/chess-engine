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
print(stockfish.get_engine_parameters())

def get_best_moves(fen: str, depth: int, num_results : int = 3):
  if (not stockfish.is_fen_valid(fen)):
    raise ValueError("fen is not valid")
  stockfish.set_fen_position(fen)
  stockfish.set_depth(depth)
  uci_top_moves = stockfish.get_top_moves(num_results)

  board = chess.Board(fen)
  result = []

  for move_info in uci_top_moves:
    move = move_info["Move"]
    if isinstance(move, str):
      uci_move = chess.Move.from_uci(move)
      result.append({
        "uci": move,
        "san": board.san(uci_move),
        "centipawn": move_info["Centipawn"],
        "mate": move_info["Mate"]
      })
    
  return result

# check whose move it is and then when it returns centipawn: xxx
# it will be that side which is doing better