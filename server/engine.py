import os
from dotenv import load_dotenv
from stockfish import Stockfish

load_dotenv()

stockfish_path = os.getenv("STOCKFISH_PATH")
if stockfish_path is None:
  raise ValueError("stockfish path is not set")

stockfish = Stockfish(path=stockfish_path)

def get_best_moves(fen: str, depth: int, num : int = 3):
  if (not stockfish.is_fen_valid(fen)):
    raise ValueError("fen is not valid")
  stockfish.set_fen_position(fen)
  stockfish.set_depth(depth)
  return stockfish.get_top_moves(num)

# check whose move it is and then when it returns centipawn: xxx
# it will be that side which is doing better
fen = "r5k1/p4pp1/2R4p/3p1b2/N4P2/1P4q1/P1P5/1K3R2 b - - 1 26"
print(get_best_moves(fen, 18))