import { useEffect, useState } from "react";
import { fetchGames } from "../api/api";
import type { SavedGame } from "../types/chessTypes";

const SavedGames = () => {
  const [games, setGames] = useState<SavedGame[]>([]);
  useEffect(() => {
    async function loadGames() {
      const data = await fetchGames();
      setGames(data.games);
    }
    loadGames();
  }, []);

  return (
    <div>
      {games.map((game) => (
        <div key={game.id}>
          <h3>
            {game.whitePlayer} vs {game.blackPlayer}
          </h3>
          <p>
            {game.whiteElo ?? "?"} - {game.blackElo ?? "?"}
          </p>
          <p>{game.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedGames;
