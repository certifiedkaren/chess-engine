from fastapi import Body, FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, List
from starlette.concurrency import run_in_threadpool
import engine as chess_engine
import asyncio
import os
from database import Base, engine as db_engine, get_db
from models import Game
from sqlalchemy import text
from sqlalchemy.orm import Session

class AnalyzeRequest(BaseModel):
    fen: str = Field(description="FEN string for current chess position")
    depth: int = Field(default=15, ge=1, le=25,
                       description="Search depth for engine")
    num_results: int = Field(default=3, ge=1, le=5,
                             description="Number of top moves to return")


class AnalyzeBatchRequest(BaseModel):
    fens: List[str] = Field(
        description="List of FEN strings for chess positions")
    depth: int = Field(default=15, ge=1, le=25,
                       description="Search depth for engine")
    num_results: int = Field(default=3, ge=1, le=5,
                             description="Number of top moves to return")


class EvaluateRequest(BaseModel):
    fen: str = Field(description="FEN string for current chess position")
    depth: int = Field(default=15, ge=1, le=25,
                       description="Search depth for engine")


class EvaluateMovesRequest(BaseModel):
    fens: List[str] = Field(
        description="List of FEN strings for chess positions")
    depth: int = Field(default=15, ge=1, le=25,
                       description="Search depth for engine")


app = FastAPI()

engine_lock = asyncio.Lock()

Base.metadata.create_all(bind=db_engine)

with db_engine.begin() as connection:
    connection.execute(
        text("ALTER TABLE games ADD COLUMN IF NOT EXISTS mainline_moves JSON DEFAULT '[]'")
    )

cors_origins = os.getenv("CORS_ORIGINS")
origins = (
    [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
    if cors_origins
    else ["http://localhost:5173", "http://localhost:5174"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze(data: AnalyzeRequest):
    try:
        async with engine_lock:
            engine_response = await run_in_threadpool(
                chess_engine.get_best_moves,
                fen=data.fen,
                depth=data.depth,
                num_results=data.num_results)
        return {"best_moves": engine_response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/batch-analyze")
async def batch_analyze(data: AnalyzeBatchRequest):
    if not data.fens:
        raise HTTPException(status_code=400, detail="no fens recieved")
    if len(data.fens) > 50:
        raise HTTPException(
            status_code=400, detail="batch size larger than 50")

    engine_best_moves = []

    async with engine_lock:
        for current_fen in data.fens:
            try:
                engine_response = await run_in_threadpool(
                    chess_engine.get_best_moves,
                    fen=current_fen,
                    depth=data.depth,
                    num_results=data.num_results)
                engine_best_moves.append(engine_response)
            except Exception as e:
                print(f"/batch-analyze failed for FEN {current_fen}")
                engine_best_moves.append(None)
                raise HTTPException(status_code=400, detail=str(e))

    return {"best_moves": engine_best_moves}


@app.post("/evaluate")
async def evaluate(data: EvaluateRequest):
    if not data.fen:
        raise HTTPException(status_code=400, detail="no fens received")

    async with engine_lock:
        try:
            engine_response = await run_in_threadpool(
                chess_engine.evaluate_position,
                fen=data.fen,
                depth=data.depth,
            )
        except Exception as e:
            print(f"evaluate failed for fen: {data.fen}")
            print(e)

    return engine_response


@app.post("/evaluate-moves")
async def evaluate_moves(data: EvaluateMovesRequest):
    if not data.fens:
        raise HTTPException(status_code=400, detail="no fens received")

    engine_evaluations = []

    async with engine_lock:
        for current_fen in data.fens:
            try:
                engine_response = await run_in_threadpool(
                    chess_engine.evaluate_position,
                    fen=current_fen,
                    depth=data.depth,
                )
                engine_evaluations.append(engine_response)
            except Exception as e:
                print(f"evaluate failed for fen: {current_fen}")
                print(e)
                engine_evaluations.append(None)

    return {"move_evaluations": engine_evaluations}

@app.post("/save-game")
async def save_game(
    data: dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
):
    game_data = data.get("gameData", data)
    requested_game = {"whitePlayer": game_data.get("whitePlayer"),
        "blackPlayer": game_data.get("blackPlayer"),
        "whiteElo": game_data.get("whiteElo"),
        "blackElo": game_data.get("blackElo"),
        "mainlineMoves": game_data.get("mainlineMoves", []),
        "mainlineFens": game_data.get("mainlineFens", []),
        "mainlineBestMoves": game_data.get("mainlineBestMoves", []),
        "branches": game_data.get("branches", []),
        "mainlineMoveEvaluations": game_data.get(
            "mainlineMoveEvaluations",
            [],
        ),
        "mainlineMoveClassifications": game_data.get(
            "mainlineMoveClassifications",
            [],
        ),
    }

    saved_games = db.query(Game).all()
    for saved_game in saved_games:
        existing_game = {
            "whitePlayer": saved_game.white_player,
            "blackPlayer": saved_game.black_player,
            "whiteElo": saved_game.white_elo,
            "blackElo": saved_game.black_elo,
            "mainlineMoves": saved_game.mainline_moves,
            "mainlineFens": saved_game.mainline_fens,
            "mainlineBestMoves": saved_game.mainline_best_moves,
            "branches": saved_game.branches,
            "mainlineMoveEvaluations": saved_game.mainline_move_evaluations,
            "mainlineMoveClassifications": (
                saved_game.mainline_move_classifications
            ),
        }
        if existing_game == requested_game:
            raise HTTPException(
                status_code=409,
                detail="This game has already been saved.",
            )

    game = Game(
        white_player=requested_game["whitePlayer"],
        black_player=requested_game["blackPlayer"],
        white_elo=requested_game["whiteElo"],
        black_elo=requested_game["blackElo"],
        mainline_moves=requested_game["mainlineMoves"],
        mainline_fens=requested_game["mainlineFens"],
        mainline_best_moves=requested_game["mainlineBestMoves"],
        branches=requested_game["branches"],
        mainline_move_evaluations=requested_game["mainlineMoveEvaluations"],
        mainline_move_classifications=requested_game[
            "mainlineMoveClassifications"
        ],
    )

    try:
        db.add(game)
        db.commit()
        db.refresh(game)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"failed to save game: {e}")

    return {"id": game.id, "database": "ok"}

@app.delete("/game/{game_id}")
async def delete_game(game_id: int, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail=f"failed to find game with id {game_id}")
    
    db.delete(game)
    db.commit()

    return {"message": "game deleted successfully"}


@app.get("/games")
async def get_games(db: Session = Depends(get_db)):
    games = db.query(Game).order_by(Game.created_at.desc()).all()
    return {
        "games": [
            {
                "id": game.id,
                "whitePlayer": game.white_player,
                "blackPlayer": game.black_player,
                "whiteElo": game.white_elo,
                "blackElo": game.black_elo,
                "mainlineMoves": game.mainline_moves,
                "mainlineFens": game.mainline_fens,
                "mainlineBestMoves": game.mainline_best_moves,
                "branches": game.branches,
                "mainlineMoveEvaluations": game.mainline_move_evaluations,
                "mainlineMoveClassifications": game.mainline_move_classifications,
                "createdAt": game.created_at,
            }
            for game in games
        ]
    }
