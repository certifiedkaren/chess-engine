interface AnalyzeProps {
  bestMoves: string[];
  onAnalyze: () => Promise<void>;
}

const Analyze = ({
  onAnalyze: onAnalyze,
  bestMoves: bestMoves,
}: AnalyzeProps) => {
  return (
    <>
      <button onClick={() => onAnalyze()}>Analyze</button>
      <p style={{ color: "white" }}>
        {bestMoves.length > 0 ? bestMoves.join(" ") : null}
      </p>
    </>
  );
};

export default Analyze;
