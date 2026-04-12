import styles from "./Sidebar.module.css";

interface Props {
  pgn: string;
  setPgn: React.Dispatch<React.SetStateAction<string>>;
  onNextMove: () => void;
  onPrevMove: () => void;
  onImportPgn: (pgn: string) => void;
  onBeginning: () => void;
  onEnd: () => void;
  mainlineMoves: string[];
}

const Sidebar = ({
  pgn,
  setPgn,
  onNextMove,
  onPrevMove,
  onImportPgn,
  onBeginning,
  onEnd,
  mainlineMoves,
}: Props) => {
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
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className={styles.movesNumber}>{rowIndex + 1}</td>
              <td>
                <button className={styles.movesButton}>{row[0]}</button>
              </td>
              {row[1] ? (
                <td>
                  <button className={styles.movesButton}>{row[1]}</button>
                </td>
              ) : null}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Sidebar;
