export type EngineMove = {
  uci: string;
  san: string;
  centipawn: number | null;
  mate: number | null;
}

export type EngineEvaluation = {
  type: string;
  value: number;
}

export type AnalyzeResponse = {
  best_moves: EngineMove[];
  fen: string;
};

export type AnalyzeBatchResponse = {
  best_moves: (EngineMove[] | null)[];
};

export type EvaluateBatchResponse = {
  move_evaluations: (EngineEvaluation | null)[];
}

export async function analyzePosition(fen: string, depth=15, numResults=3): Promise<AnalyzeResponse> {
  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen, depth, num_results: numResults }),
  });
  if (!response.ok) {
    throw new Error(`Reponse Status ${response.status}`);
  }

  const data: AnalyzeResponse = await response.json();
  return data;
}

export async function analyzeFenBatch(fens: string[], depth=15, numResults=3): Promise<AnalyzeBatchResponse> {
  const response = await fetch("http://127.0.0.1:8000/batch-analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fens, depth, num_results: numResults }),
  });
  if (!response.ok) {
    throw new Error(`Reponse Status ${response.status}`);
  }

  const data: AnalyzeBatchResponse = await response.json();
  return data;
}

export async function fetchFenEvaluation(fen: string, depth=15): Promise<EngineEvaluation> {
  const response = await fetch("http://127.0.0.1:8000/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen, depth}),
  });
  if (!response.ok) {
    throw new Error(`Reponse Status ${response.status}`);
  }

  const data: EngineEvaluation = await response.json();
  return data
}

export async function evaluateFensBatch(fens: string[], depth=15): Promise<EvaluateBatchResponse> {
  const response = await fetch("http://127.0.0.1:8000/evaluate-moves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fens, depth}),
  });
  if (!response.ok) {
    throw new Error(`Reponse Status ${response.status}`);
  }

  const data: EvaluateBatchResponse = await response.json();
  return data
}