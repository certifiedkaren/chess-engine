import { type EngineEvaluation } from "./api";

interface EvaluationProps {
  currentIndex: number;
  playedMovesEvaluation: (EngineEvaluation | null)[];
}

const EvaluationBar = ({
  currentIndex,
  playedMovesEvaluation,
}: EvaluationProps) => {
  const currentEvaluation = playedMovesEvaluation[currentIndex];
  if (!currentEvaluation) {
    return <p style={{ color: "white", fontSize: "22px" }}>No Evaluation</p>;
  }

  return (
    <>
      {currentEvaluation.type === "mate" ? (
        <p style={{ color: "white", fontSize: "22px" }}>
          {currentEvaluation?.value ? `M${currentEvaluation.value}` : null}
        </p>
      ) : (
        <p style={{ color: "white", fontSize: "22px" }}>
          {currentEvaluation?.value !== undefined
            ? (currentEvaluation.value / 100).toFixed(2)
            : null}
        </p>
      )}
    </>
  );
};

export default EvaluationBar;
