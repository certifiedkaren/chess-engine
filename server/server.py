from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import engine

class AnalyzeRequest(BaseModel):
  fen : str = Field(description="FEN string for current chess position")
  depth : int = Field(default=15, ge=1, le=25, description="Search depth for engine")
  num_results : int = Field(default=3, ge=1, le=5, description="Number of top moves to return")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
def analyze(data: AnalyzeRequest):
  if not data.fen.strip():
    raise HTTPException(status_code=400, detail="no fen received")
  if data.depth > 25:
    raise HTTPException(status_code=400, detail="enter a valid depth")
  try:
    engine_response = engine.get_best_moves(fen=data.fen, depth=data.depth, num_results=data.num_results)
    return {"best_moves": engine_response}
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))