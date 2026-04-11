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
        <ol style={{ color: "gray" }}>
          {rows.map((row, rowIndex) => (
            <li key={rowIndex} className={styles.movesRow}>
              <span className={styles.movesNumber}>{rowIndex + 1}.</span>
              <button className={styles.movesButton}>{row[0]}</button>
              {row[1] ? (
                <button className={styles.movesButton}>{row[1]}</button>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
