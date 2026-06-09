# Chess Analyzer

A full-stack chess analysis app for importing or playing through chess games, reviewing engine evaluations, and classifying moves with Stockfish.

<div align="center">
  <img src="./frontend/src/assets/analysis-board.png" alt="chess analyzer board" width="700">
</div>

## Project Structure

```text
.
├── backend/              # FastAPI server, Stockfish wrapper, and database models
├── frontend/             # React/Vite chess analysis UI
├── data/postgres/        # Local PostgreSQL data directory created by Compose
├── docker-compose.yml    # Development Compose setup
├── docker-compose.prod.yml # Production Compose setup
└── README.md
```

## Setup With Docker

The easiest way to run the app for local development is with Docker Compose.

```bash
docker compose up --build
```

Then open:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:8000
```

The development Compose setup also starts PostgreSQL:

```text
localhost:5432
```

The compose setup builds each service from its own directory:

- `frontend/Dockerfile`
- `backend/Dockerfile`

The backend Docker image installs Stockfish and sets:

```text
STOCKFISH_PATH=/usr/games/stockfish
DATABASE_URL=postgresql+psycopg://chess_user:chess_password@db:5432/chess_analyzer
```

Saved games are stored in PostgreSQL. In development, the database files are
mounted under `data/postgres/` so saved games persist across container restarts.

## Production With Docker

Build and run the production containers with:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Then open:

```text
http://localhost:8080
```

In production, nginx serves the built frontend and proxies `/api/*` requests to
the backend container. The frontend production image builds with:

```text
VITE_API_URL=/api
```

The production Compose file includes a PostgreSQL service for saved games and
sets the backend `DATABASE_URL` to use it.

## Local Development

You can also run the frontend and backend directly on your machine.

### Backend

Install Stockfish first. On Debian/Ubuntu:

```bash
sudo apt-get install stockfish
```

Create `backend/.env`:

```text
STOCKFISH_PATH=/path/to/stockfish
DATABASE_URL=postgresql+psycopg://chess_user:chess_password@localhost:5432/chess_analyzer
```

Use `which stockfish` to find the correct path for your machine.

The backend requires PostgreSQL when running outside Docker. Create a database
that matches `DATABASE_URL`, or run the Compose database service and point your
local backend at `localhost:5432`.

Create and activate a Python virtual environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

Create `frontend/.env`:

```text
VITE_API_URL=http://localhost:8000
```

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Available Frontend Scripts

Run these from `frontend/`.

```bash
npm run dev      # Start the Vite dev server
npm run build    # Type-check and build the production bundle
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Backend API

The backend exposes these endpoints:

- `POST /analyze` - analyze one FEN and return top engine moves
- `POST /batch-analyze` - analyze multiple FENs
- `POST /evaluate` - evaluate one FEN
- `POST /evaluate-moves` - evaluate multiple FENs
- `POST /save-game` - save one analyzed game to PostgreSQL
- `GET /games` - fetch saved games, newest first
- `DELETE /game/{game_id}` - delete one saved game

Request bodies use FEN strings and optional engine settings such as `depth` and `num_results`.
Saved game payloads include player metadata, mainline moves/FENs, engine lines,
move evaluations, move classifications, and branches.

The save endpoint rejects exact duplicate saved-game payloads with `409`.

## Environment Variables

Backend:

```text
STOCKFISH_PATH=/path/to/stockfish
DATABASE_URL=postgresql+psycopg://user:password@host:5432/database
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

Frontend:

```text
VITE_API_URL=http://localhost:8000
```

Do not commit `.env` files. They are intentionally excluded by `.gitignore` and the Docker ignore files.

## Notes

- The backend serializes Stockfish access with an async lock so concurrent API requests do not share the engine unsafely.
- Batch analysis is limited to 50 FENs by the API.
- Saved games require `DATABASE_URL`; the backend exits at startup if it is missing.
- The saved games page supports viewing and deleting saved analyses.
- Duplicate saved games are blocked by the backend before inserting a new row.
- If Vite starts on a port other than `5173`, the backend CORS settings may need to include that port.
