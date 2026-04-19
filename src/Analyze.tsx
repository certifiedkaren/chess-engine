import { type EngineMove } from "./api";
interface AnalyzeProps {
  bestMoves: (EngineMove[] | null)[];
  currentIndex: number;
  onAnalyze: () => Promise<string[] | void>;
}

const Analyze = ({
  onAnalyze: onAnalyze,
  currentIndex: currentIndex,
  bestMoves: bestMoves,
}: AnalyzeProps) => {
  return (
    <>
      {/* <button onClick={() => onAnalyze()}>Analyze</button> */}
      <p style={{ color: "white" }}>
        {bestMoves[currentIndex]?.map((move) => move.san).join(" ") ?? null}
      </p>
      <p style={{ color: "white" }}>
        {bestMoves[currentIndex]?.map((move) => move.centipawn).join(" ") ?? null}
      </p>

    </>
  );
};

export default Analyze;
