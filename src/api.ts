export type BestMove = {
  uci: string;
  san: string;
  centipawn: number | null;
  mate: number | null;
};

export type AnalyzeResponse = {
  best_moves: BestMove[];
  fen: string;
};

export async function analyzePosition(fen: string): Promise<AnalyzeResponse> {
  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen }),
  });
  if (!response.ok) {
    throw new Error(`Reponse Status ${response.status}`);
  }

  return response.json();
}
