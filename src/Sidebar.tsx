import styles from "./Sidebar.module.css";

type SidebarProps = {
  pgnState: {
    pgn: string;
    setPgn: React.Dispatch<React.SetStateAction<string>>;
  };
  navigation: {
    onNextMove: () => void;
    onPrevMove: () => void;
    gotoMove: (move: number) => void;
    onBeginning: () => void;
    onEnd: () => void;
    returnToMainline: () => void;
  };
  gameState: {
    mainlineMoves: string[];
    currentIndex: number;
    onMainLine: boolean;
  };
  actions: {
    onImportPgn: (pgn: string) => void;
  };
};

const Sidebar = ({
  pgnState,
  navigation,
  gameState,
  actions,
}: SidebarProps) => {
  const { pgn, setPgn } = pgnState;
  const {
    onNextMove,
    onPrevMove,
    gotoMove,
    onBeginning,
    onEnd,
    returnToMainline,
  } = navigation;
  const { mainlineMoves, currentIndex, onMainLine } = gameState;
  const { onImportPgn } = actions;

  const rows = [];
  for (let i = 0; i < mainlineMoves.length; i += 2) {
    rows.push(mainlineMoves.slice(i, i + 2));
  }

  return (
    <div className={styles.sidebarContainer}>
      <>
        <textarea
          value={pgn}
          rows={10}
          cols={50}
          onChange={(e) => setPgn(e.target.value)}
          placeholder="Paste PGN contents"
        ></textarea>
        {/* add a popup when the pgn was imported */}
        <button type="button" onClick={() => onImportPgn(pgn)}>
          import pgn
        </button>
      </>
      <div className={styles.arrowButtonGroup}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => onBeginning()}
        >
          {"<<"}
        </button>
        <button
          type="button"
          className={styles.arrowButton}
          style={{ padding: "10px 28px" }}
          onClick={() => onPrevMove()}
        >
          {"<"}
        </button>
        <button
          type="button"
          className={styles.arrowButton}
          style={{ padding: "10px 28px" }}
          onClick={() => onNextMove()}
        >
          {">"}
        </button>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={() => onEnd()}
        >
          {">>"}
        </button>
      </div>
      <div className={styles.movesContainer}>
        <table className={styles.movesTable}>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className={styles.movesNumber}>{rowIndex + 1}</td>
                {row.map((move, moveIndex) => {
                  const currentMove = rowIndex * 2 + moveIndex;
                  return (
                    <td key={currentMove}>
                      <button
                        className={`${styles.movesButton} ${currentIndex === currentMove + 1 ? styles.currentMove : ""}`}
                        onClick={() => gotoMove(currentMove + 1)}
                      >
                        {move}
                      </button>
                    </td>
                  );
                })}
                {row.length === 1 && <td key={`empty-${rowIndex}`} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!onMainLine && pgn.trim() !== "" && (
        <button onClick={() => returnToMainline()}>return to mainline</button>
      )}
    </div>
  );
};

export default Sidebar;
