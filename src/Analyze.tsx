interface AnalyzeProps {
  bestMoves: (string[] | null)[];
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
        {bestMoves[currentIndex] ? bestMoves[currentIndex].join(" ") : null}
      </p>
    </>
  );
};

export default Analyze;
