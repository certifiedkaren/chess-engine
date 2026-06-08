import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGames } from "../api/api";
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

  return (
    <div className={styles.savedGamesContainer}>
      <div>Saved Games</div>
      {games.map((game) => (
        <div key={game.id}>
          <h3>
            {game.whitePlayer} vs {game.blackPlayer}
          </h3>
          <button
            type="button"
            title={`View ${game.whitePlayer} vs ${game.blackPlayer}`}
            onClick={() => navigate(`/analyze/${game.id}`)}
          >
            View
          </button>
          <p>
            {game.whiteElo ?? "?"} - {game.blackElo ?? "?"}
          </p>
          <p>{game.createdAt.split("T")[0] ?? "no date found"}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedGames;
