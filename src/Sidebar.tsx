/* 
example pgn
1. d4 d5 2. Bf4 e6 3. e3 h6 4. Nf3 Nf6 5. Bd3 Bb4+ 6. c3 Bd6 7. Bg3 O-O 8. Nbd2
Nc6 9. Ne5 Nh7 10. Nxc6 bxc6 11. Qc2 f5 12. Bxd6 cxd6 13. O-O Qf6 14. Nf3 Bd7
15. b3 Ng5 16. Nxg5 Qxg5 17. c4 dxc4 18. bxc4 Rac8 19. Rab1 d5 20. a4 dxc4 21.
Bxc4 Qe7 22. Rb7 Qd6 23. Rxa7 Rf7 24. a5 c5 25. dxc5 Qxc5 26. Rc1 Qxa7 27. a6
Rff8 28. Qd3 Rfd8 29. Rb1 Ba4 30. Qa3 Bc2 31. Bxe6+ Kh8 32. Rc1 Rc7 33. g3 Be4
34. h3 Rxc1+ 35. Qxc1 Qxa6 36. Bf7 Qb7 37. Ba2 Rc8 38. Qd2 Qc6 39. Kh2 Qc1 40.
Qe2 Qh1# 0-1

O-O - castle kingside
O-O-O - queenside castle
add check-valid pgn function
*/

// pass the props into chessboard component, which will make
// the moves on button press
import { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [pgn, setPgn] = useState("");
  const [loadedPgn, setLoadedPgn] = useState<string | null>(null);
  const [whiteArr, setWhiteArr] = useState([]);
  const [blackArr, setBlackArr] = useState([]);

  function isValidPgn(pgn: string) {
    // implement this when I have time, checks if its a valid pgn
  }

  function filterPgn(pgn: string): string[] {
    return pgn
      .replace(/\d+\./g, "")
      .replace(/0-0|0-1|1\/2-1\/2/g, "")
      .trim()
      .split(/\s+/);
  }

  function loadPgn(pgn: string[]): {
    whiteArr: string[];
    blackArr: string[];
  } {
    let whiteArr = pgn.filter((_, i) => i % 1 == 0);
    let blackArr = pgn.filter((_, i) => i % 1 == 1);
    return { whiteArr, blackArr };
  }

  return (
    <div className={styles.sidebarContainer}>
      {!loadedPgn ? (
        <>
          <textarea
            value={pgn}
            rows={10}
            cols={50}
            onChange={(e) => setPgn(e.target.value)}
            placeholder="Paste PGN contents"
          ></textarea>
          <button type="button" onClick={() => setLoadedPgn(pgn)}>
            import pgn
          </button>
        </>
      ) : (
        <div className={styles.arrowButtonGroup}>
          <button type="button" className={styles.arrowButton}>
            {"<"}{" "}
          </button>
          <button type="button" className={styles.arrowButton}>
            {">"}{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
