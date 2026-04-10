import styles from "./Sidebar.module.css";

interface Props {
  pgn: string;
  setPgn: React.Dispatch<React.SetStateAction<string>>;
  onNextMove: () => void;
  onPrevMove: () => void;
  onImportPgn: (pgn: string) => void;
  onBeginning: () => void;
  onEnd: () => void;
}

const Sidebar = ({
  pgn,
  setPgn,
  onNextMove,
  onPrevMove,
  onImportPgn,
  onBeginning,
  onEnd,
}: Props) => {
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
        {/* also trigger on the arrow keys */}
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
    </div>
  );
};

export default Sidebar;
