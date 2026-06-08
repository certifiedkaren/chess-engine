import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames, deleteGame } from "../api/api";
import type { SavedGame } from "../types/chessTypes";
import styles from "./SavedGames.module.css";

const SavedGames = () => {
  const [games, setGames] = useState<SavedGame[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGames() {
      const data = await fetchGames();
      setGames(data.games);
    }
    loadGames();
  }, []);

  async function handleDeleteGame(gameId: number) {
    try {
      await deleteGame(gameId);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to delete game",
      );
    }
  }

  return (
    <div className={styles.savedGamesContainer}>
      <div className={styles.savedGamesHeader}>
        <h1>Saved Games</h1>
        <span>{games.length} games</span>
      </div>

      {games.length === 0 ? (
        <div className={styles.emptyState}>No saved games yet.</div>
      ) : (
        <div className={styles.gamesList}>
          {games.map((game) => (
            <article key={game.id} className={styles.gameRow}>
              <div className={styles.gameDetails}>
                <h2>
                  {game.whitePlayer} vs {game.blackPlayer}
                </h2>
                <div className={styles.gameMeta}>
                  <span>
                    {game.whiteElo ?? "?"} - {game.blackElo ?? "?"}
                  </span>
                  <span>{game.createdAt.split("T")[0] ?? "No date"}</span>
                </div>
              </div>

              <div className={styles.gameActions}>
                <button
                  type="button"
                  className={styles.viewButton}
                  title={`View ${game.whitePlayer} vs ${game.blackPlayer}`}
                  onClick={() => navigate(`/analyze/${game.id}`)}
                >
                  View
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  title={`Delete ${game.whitePlayer} vs ${game.blackPlayer}`}
                  onClick={() => handleDeleteGame(game.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedGames;
