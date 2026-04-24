import { type EngineEvaluation } from "./api";
import styles from "./EvaluationBar.module.css";

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
    return <div></div>;
  }

  function convertEvalToPercent(
    type: string,
    evaluation: number,
  ): number | undefined {
    if (!type || !evaluation) return;

    if (type === "mate_over") {
      return evaluation === 1 ? 100 : 0;
    }

    if (type === "mate") {
      return evaluation > 0 ? 100 : 0;
    }

    const maxEval = 1000;
    const tempEval = Math.max(-maxEval, Math.min(maxEval, evaluation));
    return 50 + (tempEval / maxEval) * 50;
  }

  const type = currentEvaluation.type;
  const value = currentEvaluation.value;
  const whitePercent = convertEvalToPercent(type, value);

  return (
    <>
      <div className={styles.evaluationBar}>
        <div
          className={styles.evaluationWhite}
          style={{ height: `${whitePercent}%` }}
        ></div>

        <p
          className={
            value > 0 ? styles.evaluationTextWhite : styles.evaluationTextBlack
          }
        >
          {currentEvaluation.type === "mate_over"
            ? "M0"
            : currentEvaluation.type === "mate"
              ? `M${Math.abs(currentEvaluation.value)}`
              : Math.abs(currentEvaluation.value) !== undefined
                ? Math.abs(currentEvaluation.value / 100).toFixed(2)
                : null}
        </p>
      </div>
    </>
  );
};

export default EvaluationBar;
